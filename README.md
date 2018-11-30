# What is this?
This is the music stream frontend/backend for the wired ``i.wired.sh/play``.  
# Prerequisites.
Within the file ``app.js`` at the root of the project, you'll need to update the following:
```js
new WiredStream({
        port: 3001,
        localDir: '/path/to/music/dir/',
        apiUrl: 'media',
        playerUrl: 'play',
        types: ['.mp3'],
});
```
Where ``localDir`` being the directory on the host machine (you'll need to provide the absolute path with a trailing slash, else it won't work). Feel free to add whatever music extensions to the ``types`` array, each file in the directory of ``localDir`` that have a matching extension from the ``types`` array will be appened to the file table. 

By default this application runs on port 3001 so change as you will. ``playerUrl`` and ``apiUrl`` can stay as they're and only impacts the url's which are called: 
- ``playerUrl``: localhost:3001/**play**/{id}
-  ``apiUrl``: localhost:3001/**media**/{id}

**How does it work?**
The application will read all files within the directory specified in the config, and append those with a matching file extension in the allowed types array. Each file is given it's own hash alongide an id that can be assessed from the api: ``localhost:3001/media/{id||hash}`` - this will return the particular file requested as a stream and is the main backend api of the whole application. An example could be as follows:
- ``File: Some_Song.mp3`` 
- ``ID: 20``
- ``Hash: ccabf03ddebb8d831974``

You would then make a call to the api which would result in either of ``localhost:3001/media/20`` or ``localhost:3001/media/ccabf03ddebb8d831974`` and both will give you a direct stream to the file ``Some_Song.mp3``. You can also get the song information by making a request to ``localhost:3000/media/{id}/info`` which will give you the file, id and hash in JSON format.

Once the relevant files have been pushed onto the file table you can listen to them from: ``localhost:3001/play/{id}``; you'll be greeted with a minimalistic player (yes, I have plans to add more features in the future, maybe). 
# Installation.
**Node**
If you have plans to run this application right from node, you'll have to install babel. Run this following command: ``npm install`` (to install the necessary dependencies) and ``npm install babel-cli -g`` and start by using ``babel-node app`` and it *should* be running on ``localhost:3001/play``.

**Docker**
If you're like me and using docker, build the image with ``docker build -t wired-stream .`` and run with: ``docker run -itd -p 3001:3001 --name wired-stream -v /host/dir/:/guest/dir/ wired-stream``. This *should* start, an example of mounting a host volume to the guest could be: ``-v /data/music/:/data/music/`` - the volume mounted on the guest **must** match what the ``localDir`` is set to!

Have fun. :)