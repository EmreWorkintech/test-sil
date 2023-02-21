// post routerları buraya yazın
const express = require("express");
const router = express.Router();
const Posts = require("./posts-model");

//GET REQUEST

router.get("/", async (req, res) => {
  let posts = await Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({ message: "Gönderiler alınamadı." });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı." });
    });
});

//POST

// router.post("/", (req, res) => {
//   const { title, contents } = req.body;
//   if (!title || !contents) {
//     res
//       .status(400)
//       .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
//   } else {
//     Posts.insert({ title, contents }).then(({ id }) => {
//       Posts.findById(id)
//         .then((findedPost) => {
//           res.status(201).json(findedPost);
//         })
//         .catch((error) => {
//           res
//             .status(500)
//             .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
//         });
//     });
//   }
// });

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  } else {
    try {
      let { id } = await Posts.insert({ title, contents });
      let insertedPost = await Posts.findById(id);
      res.status(201).json(insertedPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
});

router.put("/:id", async (req, res) => {
  let existPost = await Posts.findById(req.params.id);
  if (!existPost) {
    res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı." });
  } else {
    let { title, contents } = req.body;
    if (!title || !contents) {
      res
        .status(400)
        .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
    } else {
      try {
        let updatedPostId = await Posts.update(req.params.id, req.body);
        let updatedPost = await Posts.findById(updatedPostId);
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
      }
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let existPost = await Posts.findById(req.params.id);
    if (!existPost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı." });
    } else {
      await Posts.remove(req.params.id);
      res.status(200).json(existPost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinmedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    let existPost = await Posts.findById(req.params.id);
    if (!existPost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Posts.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});
module.exports = router;
