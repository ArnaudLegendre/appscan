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
        const lastChapter = await this.getLastChapter(ctx.request.body);
        ctx.request.body.dernierchapitre = lastChapter;
        let entity = await strapi.services.mangaa.create(ctx.request.body);
        return sanitizeEntity(entity, { model: strapi.models.mangaa });
    },
    async getLastChapter(manga) {
        const { data } = await axios.get(manga.url);
        const firstSplit = data.split("</link>");
        const secondSplit = firstSplit[1].split("/");
        
        return secondSplit[4];
    },
};
