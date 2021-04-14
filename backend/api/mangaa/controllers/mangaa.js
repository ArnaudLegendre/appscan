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
        let url = this.createUrl(ctx.request.body.titre);
        const rss = await this.fetchRss(url);
        const lastChapter = this.getLastChapter(await rss);
        
        const img = await this.getLinkImg(ctx.request.body.titre);
        // const img = await this.getLinkImg(namemanga);
        ctx.request.body.dernierchapitre = lastChapter;
        ctx.request.body.image = img;
        ctx.request.body.url = url;
        let entity = await strapi.services.mangaa.create(ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.mangaa });
    },
    getLastChapter(manga) {
        const firstSplit = manga.split("</link>");
        const secondSplit = firstSplit[1].split("/");
        return secondSplit[4];
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
    createUrl(manga) {
        let name = manga.replace(/\s+/g, "-")
        let url = `https://www.japscan.se/rss/${name}/`
        return url

    },
    async fetchRss(url) {
        const { data } = await axios.get(url);
        return data
    }
};
