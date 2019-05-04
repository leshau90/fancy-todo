const fs =require('fs')
const [file,name,prefix,description,...others] = process.argv.slice(2)

const data = fs.readFileSync(file,`utf8`).split('\n').map(row=>row.trim());

console.log(data)
let obj = {[name]:{}}
obj[name].prefix = prefix
obj[name].body = data
if(description) obj[name].description = description

console.log(JSON.stringify(obj,null,2))

