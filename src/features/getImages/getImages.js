"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImages = void 0;
const request = __importStar(require("request"));
const getImages = (req, res) => {
    const { showViral, section, sort, window, page } = req.body;
    console.log(req.body);
    /*
          section	:	hot | top | user. Defaults to hot
          sort	:	viral | top | time | rising (only available with user section). Defaults to viral
          page	:	integer - the data paging number
          window	:	Change the date range of the request if the section is top. Accepted values are day | week | month | year | all. Defaults to day
      */
    const url = `https://api.imgur.com/3/gallery/${section || "hot"}/${sort || "viral"}/${window || "day"}/${page || 1}?showViral=${!!showViral}&mature=false&album_previews=false`;
    const options = {
        method: "GET",
        url,
        headers: {
            Authorization: `Client-ID ${process.env.client_id}`,
        },
    };
    request.get(options, (error, response, respBody) => {
        if (error)
            throw error;
        if (response.statusCode === 200) {
            try {
                const imageData = JSON.parse(respBody);
                const data = [];
                imageData.data.forEach((item) => {
                    const post = {
                        title: item.title || "",
                        ups: item.ups || 0,
                        downs: item.downs || 0,
                        score: item.score || 0,
                    };
                    if (item.images && item.images.length > 0) {
                        item.images.forEach((element) => {
                            if (element.type.indexOf("image") === 0) {
                                data.push(Object.assign(Object.assign({}, post), { link: element.link, description: element.description, height: element.height, width: element.width }));
                            }
                        });
                    }
                });
                res.status(200);
                return res.json({ data });
            }
            catch (error) {
                res.status(500);
                return res.json({ error: "Error parsing data from Imgur" });
            }
        }
        res.status(500);
        return res.json({ error: "Internal server error!" });
    });
};
exports.getImages = getImages;
