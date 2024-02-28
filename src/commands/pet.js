import {createCanvas, loadImage} from 'canvas';
import GIFEncoder from 'gif-encoder-2';
import sharp from 'sharp';

export const PET = {
    name: 'pet',
    description: 'Exprime ton amour à ton ami (:',
    type: 1,
    options: [{
        name: 'utilisateur',
        description: 'Utilisateur dont la pp sera gracieusement carressée',
        required: false,
        type: 6
    }],
    run: async (client, interaction) => {
        const user = interaction.options.data.length
            ? await interaction.options.data[0].user.fetch()
            : await interaction.user.fetch();
        const url = user.avatarURL();
        const img = await downloadImage(url);
        const gif_name = await createGif(img);
        return interaction.followUp({files: [{attachment: gif_name, name: `$pet_${user.username}.gif`}]});
    }
}

async function downloadImage(url) {
    const blob = await (await fetch(url)).blob()
    return sharp(await blob.arrayBuffer()).toFormat('png').toBuffer();
}

const SIZE = 112;
const createGif = async (img) => {
    const pp = await loadImage(img);
    const canvas = createCanvas(SIZE, SIZE) // set the height and width of the canvas
    const ctx = canvas.getContext('2d');
    const PP_SIZE = pp.width;


    const background = () => {
        ctx.fillStyle = '#313338';
        ctx.fillRect(0, 0, SIZE, SIZE); // fill the entire canvas
    };

    const encoder = new GIFEncoder(SIZE, SIZE);
    encoder.setDelay(60);
    encoder.start(); // starts the encoder

    const left = [14, 12, 6, 10, 12];
    const top = [20, 33, 38, 33, 20];
    const right = [0, 0, 0, 0, 2];
    const bottom = [0, 0, 0, 0, 0];

    for(let i = 0; i < 5; i++){
        background();
        ctx.drawImage(pp, 0, 0, PP_SIZE, PP_SIZE, left[i], top[i], SIZE - left[i] - right[i], SIZE - top[i] - bottom[i]);
        const pet_frame = await loadImage(`resources/${i}.png`);
        ctx.drawImage(pet_frame,0, 0);
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