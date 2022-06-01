
const num1Element=document.getElementById('num1') as HTMLInputElement
const num2Element=document.getElementById('num2') as HTMLInputElement
const buttonElement=document.querySelector('button')!

type numorstring=number|string
function add(num1:numorstring,num2:numorstring){
    if(typeof num1 ==='number' && typeof num2 ==='number'){
        return num1+num2;
    }
    else if(typeof num1 ==='string' && typeof num2 ==='string'){
        return num1 +' '+num2
    }
    return +num1 + +num2;
}

const numresult:number[]=[];
const textresult:string[]=[];

type resultObjformat={
    val:number;
    timestamp:Date;
}
interface resultObjFormatusinginterface {
    val:number;
    timestamp:Date;
}

function printObj(resultObj:resultObjFormatusinginterface){
    console.log(resultObj.val)
}

buttonElement.addEventListener('click',()=>{
    const num1=num1Element.value;
    const num2=num2Element.value;
    const result=add(+num1,+num2)
    const textResult=add(num1,num2)
    printObj({val:result as number,timestamp:new Date()})
    numresult.push(result as number);
    textresult.push(textResult as string);
    console.log(numresult,textresult)


})

const promise=new Promise<string>((res,rej)=>{
    setTimeout(() => {
        res('it worked')
    }, 1000);
})

promise.then((result)=>{
    console.log(result.split('w'))
})
