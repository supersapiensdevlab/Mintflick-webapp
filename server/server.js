const express = require("express");
require("dotenv").config({ path: "../.env" });
const path = require("path");
const fs = require("fs");
const User = require("./models/user.model");
const { default: mongoose } = require("mongoose");
const app = express();

const PORT = process.env.PORT || 3000;
const indexPath = path.resolve(__dirname, "..", "build", "index.html");

async function connectingtoDB() {
  const uri = process.env.ATLAS_URI;
  // console.log(uri);
  mongoose.connect(uri);
}
connectingtoDB();

// const connection = mongoose.connection;

// connection.once("open", () => {
//   //console.log('MongoDB database connection established successfully');
// });

// static resources should just be served as they are
app.use(
  express.static(path.resolve(__dirname, "..", "build"), { maxAge: "30d" })
);
// here we serve the index.html page

app.get("/homescreen/:username/:type/:id", (req, res, next) => {
  fs.readFile(indexPath, "utf8", async (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end();
    }
    // get post info
    // const postId = req.query.id;
    // const post = getPostById(postId);
    // if (!post) return res.status(404).send("Post not found");
    const username = req.params.username;
    const type = req.params.type;
    const id = req.params.id;

    const u = await User.findOne({ username: username });
    let title = "MintFlick";
    let description =
      "Decentralized Live Streaming, Videos & NFT Marketplace. Ditch Patreon & Onlyfans and become a superfan on Mintflick to donate cryptos directly to your favourite creators.";
    let image = "https://v2.mintflick.app/Mintflick-favicon.png";
    let content = null;
    switch (type) {
      case "video":
        content = u.videos.filter((v) => {
          title = v.videoName;
          if (v.videoImage) image = v.videoImage;
          description = v.description;
          return v.videoId === id;
        });
        break;
      case "track":
        content = u.tracks.filter((v) => {
          title = v.trackName;
          if (v.trackImage) image = v.videoImage;
          description = v.description;
          return v.trackId === id;
        });
        break;
      case "post":
        content = u.posts.filter((v) => {
          title = v.announcement;
          if (v.post_image) image = v.post_image;
          // description = v.description;
          return v.postId === id;
        });
        break;
      case "poll":
        content = u.polls.filter((v) => {
          title = v.question;
          // if (v.trackImage) image = v.videoImage;
          // description = v.description;
          return v.pollId === id;
        });
        break;
      default:
      // res.status(404).send('No Content Type found');
      // return;
    }

    // inject meta tags
    htmlData = htmlData
      .replace("<title>MintFlick</title>", `<title>${title}</title>`)
      .replace("MintFlick - NFT | Streaming | Social", title)
      .replace(
        "Decentralized Live Streaming, Videos & NFT Marketplace. Ditch Patreon & Onlyfans and become a superfan on Mintflick to donate cryptos directly to your favourite creators.",
        description
      )
      .replace(
        "Decentralized Live Streaming, Videos & NFT Marketplace. Ditch Patreon & Onlyfans and become a superfan on Mintflick to donate cryptos directly to your favourite creators.",
        description
      )
      .replace("https://v2.mintflick.app/Mintflick-favicon.png", image);
    return res.send(htmlData);
  });
});
app.get("/*", (req, res, next) => {
  console.log("req is here ");
  fs.readFile(indexPath, "utf8", (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end();
    }
    // get post info
    // const postId = req.query.id;
    // const post = getPostById(postId);
    // if (!post) return res.status(404).send("Post not found");

    // inject meta tags

    // let title = "MintFlick";
    // let description =
    //   "Decentralized Live Streaming, Videos & NFT Marketplace. Ditch Patreon & Onlyfans and become a superfan on Mintflick to donate cryptos directly to your favourite creators.";
    // let image = "https://v2.mintflick.app/Mintflick-favicon.png";

    // htmlData = htmlData
    //   .replace("<title>MintFlick</title>", `<title>${title}</title>`)
    //   .replace("MintFlick", "MintFlick")
    //   .replace("Decentralized Live Streaming, Videos & NFT Marketplace. Ditch Patreon & Onlyfans and become a superfan on Mintflick to donate cryptos directly to your favourite creators.", description)
    //   .replace(
    //     "Decentralized Live Streaming, Videos & NFT Marketplace. Ditch Patreon & Onlyfans and become a superfan on Mintflick to donate cryptos directly to your favourite creators.",
    //     "Decentralized Social Media & NFT Platform"
    //   )
    //   .replace("https://v2.mintflick.app/Mintflick-favicon.png", image);
    return res.send(htmlData);
  });
});

// listening...
app.listen(PORT, (error) => {
  if (error) {
    return console.log("Error during app startup", error);
  }
  console.log("listening on " + PORT + "...");
});
