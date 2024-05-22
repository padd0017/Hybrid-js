//Vinaydeep Singh Padda 
// Date: May 21st, 2024;
const output = document.querySelector('#output'),
Url = "https://picsum.photos/v2/list?page=2&limit=200", 
saveBtn = document.querySelector("#save"),
key  = "Vinay-deep";

// console.log(headers)
let cacheRef = null;
function init() {
    fetchImage()
    saveBtn.addEventListener("click", ()=> getfromCache())
}
openCache();


async function openCache() {
cacheRef = await caches.open(key);
}

function fetchImage() {
    fetch(Url)
    .then((res) => {
        if (!res.ok) {
            throw new Error("Something is wrong");
        }
            return res.json();
    })
    .then((data) => {
        const imgURL = data.map(image => image.download_url);
        savetoCache(imgURL);
    })
    .catch((err) => {
        console.error(err);
    });
}

function savetoCache(img) {
    img.forEach(async (item)=>{
        const response = await fetch(item);
        let blob = await response.blob();
        let blobResponse = new Response(blob);
        await cacheRef.put(item, blobResponse);
    })
}

function getfromCache(){
    cacheRef.keys()
    .then( async (keys)=>{
        keys.forEach( async (item)=>{
            let response = await cacheRef.match(item);
            console.log(response);
            if(response) {
                let date = response.headers.get('date');
                console.log(date);
                let blob = await response.blob();
                let bloblink = URL.createObjectURL(blob);
                displayImage(bloblink);
            }
        })
    })
}

function displayImage(bloblink) {
    let df = new DocumentFragment;
        let img = document.createElement("img");
        img.width = 200;      
        img.height = 300;
        img.src = bloblink;
        img.alt = "Random img";
        df.append(img);
    output.append(df);   
}    

document.addEventListener('DOMContentLoaded', init);


