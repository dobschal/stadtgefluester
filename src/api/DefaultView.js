const Vue = require("vue");
const renderer = require("vue-server-renderer").createRenderer();
const { version } = require("../../package.json");

class DefaultView {
    constructor(app) {
        app.get("/", this.view.bind(this));
    }

    async view(req, res) {
        const app = new Vue({
            data: {
                version: version
            },
            template: `
            <div>
                <h3>Stadtgeflüster API</h3>
                <p><b>version: </b>{{ version }}</p>
            </div>`
        });

        renderer.renderToString(app, (err, html) => {
            if (err) {
                res.status(500).end("Internal Server Error");
                return;
            }
            res.end(`
        <!DOCTYPE html>
        <html lang="en">
            <meta charset="utf-8">
          <head><title>Stadtgeflüster</title><style>body { background-color: #000000; color: #c0c0c0; font-family: Helvetica, Arial, Sans-Serif;}</style></head>
          <body>${html}</body>
        </html>
      `);
        });
    }
}
module.exports = DefaultView;
