import * as Fs from 'fs'
import * as Https from 'https'

/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
export async function downloadFile (url: string, targetFile: string): Promise<string> {
    return await new Promise((resolve, reject) => {
        Https.get(url, response => {
            const code = response.statusCode ?? 0

            if (code >= 400) {
                return reject(new Error(response.statusMessage))
            }

            // handle redirects
            if (code > 300 && code < 400 && !!response.headers.location) {
                return resolve(
                    downloadFile(response.headers.location, targetFile)
                )
            }

            // save the file to disk
            const fileWriter = Fs
                .createWriteStream(targetFile)
                .on('finish', () => {
                    resolve(fileWriter.path as string)
                })

            response.pipe(fileWriter)
        }).on('error', error => {
            reject(error)
        })
    })
}