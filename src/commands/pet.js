import {createCanvas, loadImage} from 'canvas';
import GIFEncoder from 'gif-encoder-2';
import sharp from 'sharp';

export const PET = {
    name: 'pet',
    description: 'Exprime ton amour à ton ami (:',
    type: 1,
    options: [
        {
          name: 'utilisateur',
            description: 'Utilisateur dont la pp sera gracieusement carressée',
            required: false,
            type: 6
        },
        {
            name: 'image',
            description: 'Image à pet',
            required: false,
            type: 11
        }
    ],
    run: async (client, interaction) => {
        let url = '';
        let img_name = '';
        if(interaction.options.data.length && interaction.options.data[0].name === 'image'){
            url = interaction.options.data[0].attachment.url;
            img_name = interaction.options.data[0].attachment.name.split('.').shift();
        } else {
            const user = interaction.options.data.length && interaction.options.data[0].name === 'utilisateur'
                ? await interaction.options.data[0].user.fetch()
                : await interaction.user.fetch();
            img_name = user.username;
            url = user.avatarURL();
        }
        const img = await downloadImage(url);
        const gif_name = await createGif(img);
        return interaction.followUp({files: [{attachment: gif_name, name: `$pet_${img_name}.gif`}]});
    }
}

async function downloadImage(url) {
    const blob = await (await fetch(url)).blob()
    return sharp(await blob.arrayBuffer()).toFormat('png').toBuffer();
}

const PET_SIZE = 112;
const createGif = async (img_buffer) => {
    const img = await loadImage(img_buffer);
    const img_size = img.width < img.height ? img.width : img.height;
    const canvas = createCanvas(img_size, img_size) // set the height and width of the canvas
    const ctx = canvas.getContext('2d');


    const background = () => {
        ctx.fillStyle = '#313338';
        ctx.fillRect(0, 0, img_size, img_size); // fill the entire canvas
    };

    const encoder = new GIFEncoder(img_size, img_size);
    encoder.setDelay(60);
    encoder.start(); // starts the encoder

    const left = [14, 12, 6, 10, 12];
    const top = [20, 33, 38, 33, 20];
    const right = [0, 0, 0, 0, 2];
    const bottom = [0, 0, 0, 0, 0];


    const ratio = img_size/PET_SIZE
    const sx = img.width > img.height ? img.width/2 - img.height/2 : 0;
    const sy = img.height > img.width ? img.height/2 - img.width/2 : 0;

    for(let i = 0; i < 5; i++){
        background();
        const dx = left[i];
        const dy = top[i];
        const dw = PET_SIZE - left[i] - right[i];
        const dh = PET_SIZE - top[i] - bottom[i];
        ctx.drawImage(img, sx, sy, img_size, img_size, dx*ratio, dy*ratio, dw*ratio, dh*ratio);
        const pet_frame = await loadImage(`resources/${i}.png`);
        ctx.drawImage(pet_frame,0, 0, img_size, img_size);
        encoder.addFrame(ctx);
    }

    // end the encoding
    encoder.finish();
    const buffer = encoder.out.getData();
    return buffer;
    //const filename = `pet_${new Date().getTime()}.gif`
    //await new Promise(resolve => fs.writeFile(filename, buffer, resolve));
    //return filename;
}