//Joshua Fernandes, Goa University, 1615, WebTech Assignment 1 


//"use strict"; // cannot use if you want to check the caller function

//initialisation of variables
var i,j;
var n;
var rn;//restart grid size
var width=600;
var height=600;
var splitCell=[];
var player1=0;
var player2=0;
var player=0;


//creating the grid
function createGrid(){
	player1=0;
	player2=0;
	player = 0;
	splitCell=[];
	
	if(createGrid.caller==restart) n=rn;
	else n=document.getElementById("gridsize").value;
	
	if(n==0)
	{
		alert("Please Enter Grid size");
	}
	else{
		document.getElementById("container").style.display="block"; //Making the grid visible
		document.getElementById("sidebar").style.float="left";	
		document.getElementById("box").innerHTML=""; //clearing the div
		var sel=document.getElementById("player");
		var noOfPlayers=sel.options[sel.selectedIndex].value;
		
			for(i=0;i<n;i++){
				for(j=0;j<n;j++){
					var cell=document.createElement('div');     
					cell.id=i+""+j;
					cell.className="cell";
					cell.style.width=width/n-6+"px";
					cell.style.height=height/n-6+"px";
					cell.mass=0;
					cell.criticalMass=-1;
					cell.player=-1;
					cell.direction=[0,0,0,0];//top,down,left,right Assigning each cell a direction array
					document.getElementById("box").appendChild(cell);
					
					if(i!=0){cell.criticalMass++; cell.direction[0]=1;}	//assingning critical mass to each cell along with directions
					if(j!=0){cell.criticalMass++; cell.direction[2]=1;}
					if(i!=(n-1)){cell.criticalMass++; cell.direction[1]=1;}
					if(j!=(n-1)){cell.criticalMass++; cell.direction[3]=1;}
				}
			}
		}
	}
	
	//first function to be called that adds image,checks for winner and toggles player after their turn.
	function startFunction(event){ 
		var obj=event.target;
		if(obj.tagName=="IMG"){
		if(obj.parentElement.player==player){
			//checkPlayer(obj);
			addimg(obj);
			checkWinner();
			togglePlayer();
			declareWinner();
		}
		}
		else if(obj.className=="cell"){
			if(obj.player==player || obj.player==-1)
				addimg(obj);
				togglePlayer();
		}
	}

/*	function checkPlayer(obj){
		if(obj.className=="image" || obj.className=="cell")
		{
			if(obj.player==player | obj.player==-1){}
			else
			{
				alert("Player"+player+"'s turn");
			}
		}
	}*/

	
	function togglePlayer(){  //changing player
	var d=document.getElementById("container");
	var cell=document.getElementsByClassName("cell");
		if(player==0){
				player=1;
				d.style.borderColor="#c930af";
				for(var i=0;i<cell.length;i++)
				{
					cell[i].style.borderColor="#c930af";
				}
			}
		else {
				player=0;
				d.style.borderColor="#38B50D";
				for(var i=0;i<cell.length;i++)
				{
					cell[i].style.borderColor="#38B50D";
				}
			}
		}
		
	
	function addimg(obj){	 //adding image according to mass and player
		
			if(obj.firstChild) //checking if the event returns a Div(cell) or Img Element
				obj=obj.firstChild;
							
						if(obj.className=="cell") //Div Element
							{	
								var x = document.createElement("IMG"); //creating the image element for insertion
								x.style.width="100%";
								x.style.height="100%";
								x.style.position="absolute";
								x.className="image";
								if(obj.mass==0){
									if(player==0){ x.src="images/Obj-0-1.gif";obj.player=player;}
									else{ x.src="images/Obj-1-1.gif";obj.player=player;}
									obj.appendChild(x);
									obj.mass++;
								}
							}
								
								if(obj.className=="image"){ //Image Element
									var mass=obj.parentElement.mass;
									var cmass=obj.parentElement.criticalMass;
									if(player==0){ //Checking Player
										
										if((mass==1) && (mass < cmass)){ //adding image depending on mass and critical mass
											obj.src='images/Obj-0-2.gif';
											obj.parentElement.mass++;	
											obj.parentElement.player=player;	//changing player after image is inserted
										}
										else if((mass==2) && (mass < cmass)){//adding image depending on mass and critical mass
											obj.src="images/Obj-0-3.gif";
											obj.parentElement.mass++;	
											obj.parentElement.player=player;	//changing player after image is inserted
										}
										else if((mass==3) || (mass >= cmass)){
											obj.parentElement.mass=0;
											split(obj); //calling the split function since critical mass has been reached
											playSound();
											obj.parentElement.player=-1;
											obj.parentElement.removeChild(obj);	
										}
									}
									else{
											
											if((mass==1) && (mass < cmass)){	//adding image depending on mass and critical mass
												obj.src='images/Obj-1-2.gif';
												obj.parentElement.mass++;
												obj.parentElement.player=player;	//changing player after image is inserted
											}
											else if((mass==2) && (mass < cmass)){	//adding image depending on mass and critical mass
												obj.src="images/Obj-1-3.gif";
												obj.parentElement.mass++;
												obj.parentElement.player=player;	//changing player after image is inserted
											}
											else if((mass==3) || (mass >= cmass)){
												obj.parentElement.mass=0;
												split(obj); //calling the split function since critical mass has been reached
												playSound();
												obj.parentElement.player=-1;
												obj.parentElement.removeChild(obj);	//resetting the cell
											}
									}
									
								}
							while(splitCell.length>0){	//storing the next element 
								var obj=splitCell.shift();
								try {
								addimg(obj);
								} catch (ex) {
								break;
								}
							}
				}
	
	function split(obj){
		var dir=obj.parentElement.direction;					
		if(dir[0]==1){moveTop(obj);}	//moving top
		if(dir[1]==1){moveDown(obj);}	//moving down
		if(dir[2]==1){moveLeft(obj);}	//moving left
		if(dir[3]==1){moveRight(obj);}	//moving right	
	}
	
	function playSound()
	{
		 var pop=document.getElementById("myAudio");
		 pop.play();
	}

	
		function moveTop(x){
			x=x.parentElement;
			for(var i=0;i<n;i++){ x=x.previousSibling; }
			splitCell.push(x);
		}

		function moveDown(x){
			var x=x.parentElement;
			for(var i=0;i<n;i++){ x=x.nextSibling; }
			splitCell.push(x);
		}

		function moveLeft(x){
			splitCell.push(x.parentElement.previousSibling);
		}

		function moveRight(x){
			splitCell.push(x.parentElement.nextSibling);
		}
		
		
	function checkWinner(){ //to check is all the divs are filled with one player image element
		var cells = document.getElementsByClassName("cell");
		player1=0;
		player2=0;
		for (var i = 0; i < cells.length; i++) {
			if(cells[i].player==0){
				player1++;
			}
			else if(cells[i].player==1){
				player2++;
			}
		}
	}
	function declareWinner()
	{
		var d=document.getElementById("container");
		var over=document.getElementById("gameOver");
		if(player1==0 || player2==0 ){
			if(player1==0){
				d.style.borderColor="black";
				setTimeout(function() {  document.getElementById("box").innerHTML=""; //clearing the div
				document.getElementById("box").innerHTML="<button id='playAgain' type='button' onClick='restart()'><span >PLAYER "+2+" WINS<br>CLICK TO PLAY AGAIN</span></button>"}, 500);
				over.play();
				
			}
			else if(player2==0){
				d.style.borderColor="black";
				setTimeout(function() { document.getElementById("box").innerHTML=""; //clearing the div
				document.getElementById("box").innerHTML="<button id='playAgain' type='button' onClick='restart()'><span >PLAYER "+1+" WINS<br>CLICK TO PLAY AGAIN</span></button>"}, 500);
				over.play();
			}	
		}
		
	}
	function restart()
	{
		rn = window.prompt("Enter Grid Size.");
		createGrid();
	}