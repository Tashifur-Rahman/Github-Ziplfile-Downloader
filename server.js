require('dotenv').config()
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app=express()
const PORT=process.env.PORT
const ACCESS_KEY=process.env.ACCESS_KEY
app.use(express.json())
console.log('\n')
console.log('┌─ GITHUB zip downloader ─────────────────────────┐')
console.log(`|  URL      : http://localhost:${PORT}`)
console.log('└─────────────────────────────────────────────────┘\n')

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});
//extractinfo already defined in index.html
// var url=document.getElementById('url-input').value ;
// function extractinfo(githuburl)
// {
//     const {pathname}=new URL(githuburl);
//     const[owner,repo,branch]=pathname.split('/').filter(Boolean);
//     return {owner,repo,branch};
// }
// extractinfo(url);
// //Destructuring the returned object to get owner, repo and branch details
// const { owner, repo, branch } = extractinfo(url);
// console.log('\n Github repo details:\n')
// console.log(`Owner:${owner}\n Repository:${repo}\n Branch:${branch}`);

app.post('/api/verify-key',(req,res)=>{
    const {key}=req.body
    if(!key || typeof(key)!=='string')
       return res.status(400).json({success:false,message:'No key provided'});
    if(key.trim()!==ACCESS_KEY)
        return res.status(401).json({success:false,message:'Invalid auth key'});
    else
        return res.status(200).json({success:true,message:'Key verified. Initiating secure download...'});

});

app.get('/api/download', async(req,res)=>{
    const {key,owner,repo,branch}=req.query;
    if(!key || key.trim()!==ACCESS_KEY)
        return res.status(401).send('Unauthorized...')
    if(!owner || !repo || !branch)
        return res.status(400).send('Missing repo,owner or branch...');
    const archiveUrl=`https://codeload.github.com/${owner}/{repo}/zip/refs/heads/${branch}`;
    console.log(`Fetching ${archiveUrl}`);
    // fetch the zip from github
    const githubres=await fetch(archiveUrl);

    if(githubres.status>=200 && githubres.status<300)//if status not ok [status is ok between 200-299]
    return res.status(502).send(`Github responded ${githubres.status}`);

    //tell the browser this is a file download
    res.setHeader('Content-Disposition',`attachment; filename="${repo}.zip"`);
    res.setHeader('Content-type','application/zip');

    // send the zip directly to the browser
    githubres.body.pipe(res);
})


app.listen(PORT,()=>{
    console.log(`app running at http://localhost:${PORT}`);
});