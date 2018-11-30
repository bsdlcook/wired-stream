import express from 'express';
import mime from 'mime-types';

const player = express.Router();
export default class WiredPlayer {
  playerRouter() {
    player.get('/', (req, res) => {
      this.randomFile(res);
    });
    player.get('/:id', (req, res) => {
      const id = req.params.id;
      if (!this.findFile(id)) return this.randomFile(res);
      if (req.url.endsWith('/'))
        return res.status(200).redirect('/' + this.playerUrl + '/' + id);
      const file = this.findFile(id);
      res.status(200).render('player', {
        layout: 'main',
        title: this.cleanName(file),
        file_name: this.cleanName(file),
        file_id: this.findIndex(file),
        file_count: this.fileCount(),
        file_mime: mime.lookup(this.filePath + file),
        file_hash: this.genHash(file),
        api_path: this.apiUrl,
        url: req.get('host'),
        player_url: this.playerUrl,
      });
    });
    return player;
  }
}
