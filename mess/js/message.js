let build=document.getElementById('mess');
build.addEventListener('keypress', () => {
       let sendnu=document.getElementsByClassName('micro');
       let sendnu1=document.getElementsByClassName('micro1');
       sendnu[0].style.display='none';
       sendnu1[0].style.display='flex'; 
})
function sendit(){
       let sendnu=document.getElementsByClassName('micro');
       let sendnu1=document.getElementsByClassName('micro1');
       if(build.value==''){
              sendnu1[0].style.display='none';
              sendnu[0].style.display='flex';
       } 
}


function basBhai(){
       let sendnu=document.getElementsByClassName('chating');
       let sendnu1=document.getElementsByClassName('documentdibba');
       let head=document.getElementsByClassName('heading3');
       let head1=document.getElementsByClassName('last');
       sendnu[0].style.display='block';
       sendnu1[0].style.display='none';
       head1[0].style.display='none';
       head[0].style.display='flex';
}