![](https://gitlab.com/lust3088/wired-stream/badges/master/build.svg)
# What is this?
This is the music stream frontend/backend for the wired ``i.wired.sh/play``.  
# Prerequisites.
Within the file ``app.js`` at the root of the project, you'll need to update the following:
```js
new WiredStream({
        localDir: '/path/to/music/dir/',
        types: ['.mp3']
});
```
Where **localDir** being the directory on the host machine (you'll need to provide the absolute path with a trailing slash, else it won't work). Feel free to add whatever music extensions to the **types** array, each file in the directory of **localDir** that has a matching file extension from the **types** array will be appended to the file table. 

By default this application listens on port 3000 (change the default by using **port** in the constructor) so update as you will. **playerUrl** (**play**) and **apiUrl** (**media**) can stay as they're and only impacts the url's which are used: 
- ``playerUrl``: localhost:3000/**play**/{id}
-  ``apiUrl``: localhost:3000/**media**/{id}

However, if you wish to override the defaults you can by specifying them in the WiredStream class constructor for example:
```js
new WiredStream({
        port: 1337,
        localDir: '/my/awesome/music/',
        types: ['.mp3']
        playerUrl: 'foo', /* here... */
        apiUrl: 'bar' /* and here. */
});
```
**How does it work?**
The application will read all files within the directory specified in the config, and append those with a matching file extension in the allowed types array. Each file is given its own 10-char hash (change the default by using **hashLen** in the constructor) alongside an id that can be assessed from the api: **localhost:3000/media/{id||hash}** - this will return the particular file requested as a stream and is the main backend api of the whole application. An example could be as follows:
- ``File``: **Some_Song.mp3** 
- ``ID``: **20**
- ``Hash``: **ccabf03d8g**

You would then make a call to the api which would result in either of **localhost:3000/media/20** or **localhost:3000/media/ccabf03d8g** and both will give you a direct stream to the file (**Some_Song.mp3**). You can also retrieve the song information by making a request to **localhost:3000/media/{id}/info** which will give you the *file*, *id* and *hash* in JSON format.

Once the relevant files have been pushed onto the file table you can listen to them via the url: **localhost:3000/play/{id}**; you'll be greeted with a minimalistic player (yes, I have plans to add more features in the future, maybe). 
# Shortcuts.
There's a plethora of different key bindings available to make things easier with a keyboard. They're as the following:
- Press **SPACE** key to **pause**/**play**.
- Press **Left Ctrl** and **Right Ctrl** keys to **rewind**/**fastforward 5 seconds** respectively.
- Press **Left Arrow** and **Right Arrow** keys to go **previous**/**next** song respectively.
- Press **Up Arrow** and **Down Arrow** keys to **raise**/**lower the volume** respectively.

*Vim keybindings also work (j,k-rewind/fastforward, h,l-previous/next)*.
# Installation.
**Node**
If you have plans to run this application right from node, you'll have to install babel. Run this following command: ``npm install`` (to install the necessary dependencies) and ``npm install babel-cli -g`` and start by using ``babel-node app`` and it *should* be running on **localhost:3000/play**.

**Docker**
If you're like me and using docker, build the image with ``docker build -t wired-stream .`` and run with: ``docker run -itd -p 3000:3000 --name wired-stream -v /host/dir/:/guest/dir/ wired-stream``. This *should* start, an example of mounting a host volume to the guest could be: ``-v /data/music/:/data/music/`` - the volume mounted on the guest **must** match what the **localDir** is set to!

Have fun. :)