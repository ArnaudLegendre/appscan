'use strict';
const Window = require('window');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const axios = require('axios');
module.exports = {
    async create(ctx) {
        const rss = await this.fetchRss(ctx.request.body)
        const lastChapter = this.getLastChapter(await rss);
        const namemanga = this.getName(await rss)
        const img = await this.getLinkImg(namemanga)
        ctx.request.body.dernierchapitre = lastChapter;
        ctx.request.body.image = img;
        let entity = await strapi.services.mangaa.create(ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.mangaa });
    },
    getLastChapter(manga) {
        const firstSplit = manga.split("</link>");
        const secondSplit = firstSplit[1].split("/");
        return secondSplit[4];
    },
    getName(manga) {
        const firstSplit = manga.split("</link>");
        const secondSplit = firstSplit[1].split("/");
        return secondSplit[3]
    },
    async getLinkImg(manga) {
        const url = `https://kitsu.io/api/edge/manga?filter[text]=${manga}/`;
        const option = {
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        }
        let req;
        req = await axios.get(url, option);
        const img = req.data.data[0].attributes.posterImage.small;
        return img
    },
    async fetchRss(manga) {
        const { data } = await axios.get(manga.url);
        return data
    }
};
