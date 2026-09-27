import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { deflateSync } from 'node:zlib';

const outDir=path.resolve('icons');
await mkdir(outDir,{recursive:true});

function crc32(buffer){
  let crc=0xffffffff;
  for(const byte of buffer){
    crc^=byte;
    for(let i=0;i<8;i++)crc=(crc>>>1)^(0xedb88320&-(crc&1));
  }
  return (crc^0xffffffff)>>>0;
}
function chunk(type,data){
  const typeBuf=Buffer.from(type,'ascii');
  const length=Buffer.alloc(4);length.writeUInt32BE(data.length);
  const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(Buffer.concat([typeBuf,data])));
  return Buffer.concat([length,typeBuf,data,crc]);
}
function makePng(size){
  const stride=size*4+1, raw=Buffer.alloc(stride*size);
  const bg=[7,16,29,255],green=[99,245,164,255],cyan=[77,201,255,255],gold=[255,215,106,255];
  function pixel(x,y,c){
    if(x<0||y<0||x>=size||y>=size)return;
    const o=y*stride+1+x*4;raw[o]=c[0];raw[o+1]=c[1];raw[o+2]=c[2];raw[o+3]=c[3];
  }
  for(let y=0;y<size;y++){raw[y*stride]=0;for(let x=0;x<size;x++)pixel(x,y,bg);}
  const cell=Math.max(10,Math.floor(size/10)),ox=Math.floor((size-cell*6)/2),oy=Math.floor((size-cell*5)/2);
  const snake=[[0,3],[1,3],[2,3],[2,2],[2,1],[3,1],[4,1],[5,1]];
  for(let i=0;i<snake.length;i++){
    const [gx,gy]=snake[i],c=i===snake.length-1?cyan:green,x0=ox+gx*cell,y0=oy+gy*cell,pad=Math.max(2,Math.floor(cell*.15));
    for(let y=y0+pad;y<y0+cell-pad;y++)for(let x=x0+pad;x<x0+cell-pad;x++)pixel(x,y,c);
  }
  const fx=ox+5*cell+Math.floor(cell/2),fy=oy+4*cell+Math.floor(cell/2),r=Math.max(2,Math.floor(cell*.24));
  for(let y=fy-r;y<=fy+r;y++)for(let x=fx-r;x<=fx+r;x++)if((x-fx)**2+(y-fy)**2<=r**2)pixel(x,y,gold);
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}
for(const size of [180,192,512]){
  const file=path.join(outDir,'modern-snake-'+size+'.png');
  await writeFile(file,makePng(size));
  console.log('Generated '+file);
}
