export function random(len:number){

    let options="jduhudhudhhuhwncndnjdnj8387483487"
    let length= options.length;

    let answer="";
    for(let i=0;i<len;i++){
        answer+=options[Math.floor((Math.random()*length)) ]  //0 =>20
     }

     return answer;
}