import WiredStream from './stream';

new WiredStream({
  port: 3001,
  localDir: '/path/to/music/dir/',
  apiUrl: 'media',
  playerUrl: 'play',
  types: ['.mp3'],
});
