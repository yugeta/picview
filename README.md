PicView
==
```
Author : Yugeta.Koji
Date   : 2020.05.31
```

# Summary
 like light-box.

# Setting
  See sample. (sample/index.html)

  - Header-area
  <script src="../src/picview.js"></script>

  - Contents-bottom
  <script>
    new $$picview({
      // 拡大表示させるimage(element)の、selectors
      target : ".img-lists img",

      // 拡大表示しうる画像にマウスオーバーすると、少し浮き上がるアニメーションをさせる
      mouseover_action : true,

      // 画面に対しての表示領域 (0.0 ~ 1.0)
      window_limit_weight : 0.95,

      // 対象イメージの順番（配列）で表示する画像を入れ替えることが可能。
      // （data-picview-src="ファイルパス"属性で、タグに直接書き込む事も可能）
      swap_images : ["001_view.jpg","","003_view.jpg"],

      // 追加要素の指定
      add_elements : [
        {
          "html" : ""
        }
      ]
    });
  </script>


# History
ver 1.0 : image like light-box
ver 2.0 : add control-buttons