class Topic{
  constructor(topicId, label, postCount, lastPost, lastPostDate, posts){
    this.topicId = topicId;
    this.label = label;
    this.postCount = postCount;
    this.lastPost = lastPost;
    this.posts = posts;
}
}

class Post{
  constructor(postID,  author, message, time){
    this.postID = postID;
    this.author = author;
    this.message = message;
    this.time = time;
  }
}

class Game{
  constructor(gameName, operation, goal, howToStart, wdh, hgt){
    this.gameName = gameName;
    this.operation = operation;
    this.goal = goal;
    this.howToStart = howToStart;
    this.wdh = wdh;
    this.hgt = hgt;
  }
}

// show the given page, hide the rest
  function show(elementID) {
    // try to find the requested page and alert if it's not found
    var ele = document.getElementById(elementID);
    if (!ele) {
      alert("no such element");
      return;
    }
    // get all pages, loop through them and hide them
    var pages = document.getElementsByClassName('page');
    for(var i = 0; i < pages.length; i++) {
      pages[i].style.display = 'none';
    }
    // then show the requested page
    ele.style.display = 'block';
  }
// replace single quote with double single quote
  function messagePreprocess(msg){
    return msg.replace(/\'/g, "''");
  }

  /* =========Global variables======== */
  var loFlag = 0; // 登录标识,为0---未登录,为1---已登录
  var USERNAME;
  var flag = 0;//status of updateProfile
  var flag_password = 0; //password confirm flag
  var topicId_display;
  var label_display;
  var storedGames = [];

  /* ========USER-PROFILE============ */
  var aa;
  function getValue(obj) {
    aa = obj.value;
    /* alert(aa); */
  }

class TopicUI{
  static displayTopics(storedTopics){
    TopicUI.clearTopics();
    storedTopics.forEach((topic)=>TopicUI.addTopicToList(topic));
  }

  static addTopicToList(topic){
    const topic_list = document.querySelector('#forum_topic');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><h3 class="h5 mb-0"><a href="#" id="${topic.topicId}">${topic.label}</a></h3>
    <p class="mb-0">${topic.lastPost + "　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　"}</p>
    </td>
    <td><div>${topic.postCount}</div></td>
    <td><div>${topic.lastPostDate}</div></td>
    `;
    topic_list.appendChild(row);
  }

  static clearTopics(){
    const topic_list = document.querySelector('#forum_topic');
    topic_list.innerHTML = ` `;
  }

}

class PostUI{
    static displayPosts(storedPosts){
      PostUI.clearPosts();
      if(storedPosts.length == 0){
        document.querySelector('#forum_post_title').textContent = label_display;
        const post_list = document.querySelector('#forum_post');
        post_list.innerHTML = ``;
        show('Page-Post');
      }else{
        storedPosts.forEach((post)=>PostUI.addPostToList(post));
      }

    }

  static addPostToList(post){
    document.querySelector('#forum_post_title').textContent = label_display;
    const post_list = document.querySelector('#forum_post');

    const row1 = document.createElement('tr');
    row1.innerHTML = `
    <tr>
    <td class="author-col">
    <div><a href="#">${post.author}</a></div>
    </td>
    <td class="post-col">
    <div><span class="font-weight-bold">Posted:</span>${post.time}</div>
    </td>
    </tr>
    `;
    const row2 = document.createElement('tr');
    row2.innerHTML = `
      <td></td>
      <td><p>${post.message+"　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　"}</p></td>
    `;
    post_list.appendChild(row1);
    post_list.appendChild(row2);
    show('Page-Post');
  }

  static clearPosts(){
    const post_list = document.querySelector('#forum_post');
    post_list.innerHTML = ``;
  }
}

class GameUI{
  static displayGame(storedGames){
    GameUI.clearGame();
    if(storedGames.length == 0){
      console.log("no game");
    }else{
      storedGames.forEach((game)=>{
        GameUI.addGameToList(game)
      });
      show('Page-Game');
    }
  }
  static addGameToList(game){
    const game_list = document.getElementById('game-collection');
    game_list.innerHTML += `
    <div class="col-lg-3 col-md-4 col-sm-6 padding">
      <div class="card border-dark">
        <img src="game\\${game.gameName}.png" style="height: 180px;" class="card-top-img">
        <div class="card-body">
          <h3>${game.gameName}</h3>
          <a href="#" class="btn btn-outline-dark btn-lg">PLAY</a>
        </div>
      </div>
    </div>`;

  }
  static clearGame(){
    const game_list = document.getElementById('game-collection');
    game_list.innerHTML = ``;
  }
}

/* ---------------------------------------------------
    WebSocket
----------------------------------------------------- */

var sock = new WebSocket("ws://10.71.101.242:9090/websocket");

sock.onopen = function(){
  sock.send("displayTopic");
}

sock.onmessage = function processMessage(event){
  message = event.data;
  var res = message.split('🌴');
  var cnt;
  switch(res[0]){
    case "displayTopic":
      console.log(res);
      cnt = parseInt(res[1]);
      var storedTopics = [];
      for(var i=0; i<cnt; i++){
        storedTopics[i] = new Topic();
        storedTopics[i].topicId = res[2+i*5];
        storedTopics[i].label = res[3+i*5];
        storedTopics[i].postCount = res[4+i*5];
        storedTopics[i].lastPost = res[5+i*5];
        storedTopics[i].lastPostDate = res[6+i*5];
      }
      TopicUI.displayTopics(storedTopics);
      break;
    case "displayPost":
      console.log(res);
      topicId_display = parseInt(res[1]);
      cnt = parseInt(res[2]);
      var storedPosts = [];

      for(var i=0; i<cnt; i++){
        storedPosts[i] = new Post();
        storedPosts[i].postID = res[3+i*4];
        storedPosts[i].author = res[4+i*4];
        storedPosts[i].message = res[5+i*4];
        storedPosts[i].time = res[6+i*4];
      }
      PostUI.displayPosts(storedPosts);
      break;
    case "addTopic":
      console.log(res);
      sock.send("displayTopic");
      break;
    case "addPost":
      console.log(res);
      sock.send("displayPost🌴" + topicId_display);
      break;
    case "displayGame":
      console.log(res);
      cnt = parseInt(res[1]);
      console.log(cnt);
      storedGames = [];
      for(var i=0; i<cnt; i++){
        storedGames[i] = new Game();
        storedGames[i].gameName = res[2+6*i];
        storedGames[i].operation = res[3+6*i]
        storedGames[i].goal = res[4+6*i]
        storedGames[i].howToStart = res[5+6*i]
        storedGames[i].wdh = res[6+6*i]
        storedGames[i].hgt = res[7+6*i]
      }
      GameUI.displayGame(storedGames);
      break;
    case "login":
      if(res[2] == "Right"){
        alert("Login successful!");
        document.getElementById("myAccount").innerHTML=res[1];
        document.getElementById("myAccount").onclick=function(){show('Page-Account');}
        USERNAME = res[1];
        document.getElementById('UPMN').innerHTML = res[1];
        document.getElementById('UPEE').innerHTML = res[6];
        //if(res[9] == "[object HTMLImageElement]"){
          //document.getElementById('curAvatar').src = "img/myAvatar1.png";
        //}else{
          document.getElementById('curAvatar').src = res[9];
        //}
		var avatar = document.getElementById('curAvatar').src;
		var avatar_idx = avatar.indexOf("nuna-final/");
		if(avatar != -1) avatar = avatar.substr(avatar.length - 17, avatar.length);
		if(document.getElementById('Av1').value == avatar){
			document.getElementById('Av1').checked = "checked";
		}else if(document.getElementById('Av2').value == avatar){
			document.getElementById('Av2').checked = "checked";
		}else if(document.getElementById('Av3').value == avatar){
			document.getElementById('Av3').checked = "checked";
		}else{
			document.getElementById('Av4').checked = "checked";
		}

        document.getElementById('UPU').value = res[1];
        document.getElementById('UPFN').value = res[3];
        document.getElementById('UPLN').value = res[4];
        document.getElementById('UPRP').value = res[5];
        document.getElementById('UPE').value = res[6];
        document.getElementById('UPT').value = res[7];
        document.getElementById('UPW').value = res[8];
        show('Page-Home');
      }
      else{
        alert(res[2]);
      }
      break;
		case"register":
			if(res[1] == "Right: registration is accepted."){
				alert('Register successful!');
				show('Page-Login');
			}
			else if(res[1] == "Error: this account already exists."){
				alert('The user name already exists');
			}
  	  break;
    }
}
sock.onerror = function(event) {
  console.log(event);
  alert("Network connection error. Please try to refresh the page.");
}
sock.onclose = function(event){
  console.log(event);
  alert("Network connection error. Please try to refresh the page.");
}

// 	//发送消息
function send(message){
 	sock.send(message);
 }


/* ---------------------------------------------------
    Event
----------------------------------------------------- */

function smoothscroll(){
		var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
		if (currentScroll > 0) {
			 window.requestAnimationFrame(smoothscroll);
			 window.scrollTo (0,currentScroll - (currentScroll/5));
		}
	}

document.getElementById('topic_submit').onclick = function(){
  if(loFlag == 0){
    alert("Please Login First.");
    show('Page-Login');
  }else{
    const label = document.getElementById('topic_text').value;
    document.getElementById('topic_text').value = null;

    sock.send("addTopic🌴" + USERNAME + "🌴" + messagePreprocess(label));
    alert("Add Topic Success");
	  smoothscroll();
  }
};

document.getElementById('forum_topic').onclick = function(e){
  if(e.target.tagName == 'A'){
    topicId_display = e.target.getAttribute('id');
    label_display = e.target.textContent;
    console.log(topicId_display);
    console.log(label_display);
    sock.send("displayPost🌴" + topicId_display);
  }else{
    console.log("click again");
  }
};

document.getElementById('post_submit').onclick = function(){
  if(loFlag == 0){
    alert("Please Login First.");
    show('Page-Login');
  }else {
    const message = document.getElementById('post_text').value;
    const label = document.getElementById('forum_post_title').textContent;
    console.log(message);
    console.log(label);
    console.log(topicId_display);
    document.getElementById('post_text').value = null;

    sock.send("addPost🌴" + topicId_display + "🌴" + USERNAME +"🌴" + messagePreprocess(message));
    alert("Post Success");
  }
};

document.getElementById('forum_breadcrumb').onclick = function(){
  sock.send("displayTopic");
  show('Page-Topic');
};

document.querySelector('.game-nav').addEventListener('click', (e)=>{
  const gameType = e.target.textContent;
  console.log(gameType);
  if(gameType == 'Community'){
    show('Page-Topic');
  }else if('Action Logic Strategy'.indexOf(gameType) != -1 && gameType != ""){
    document.getElementById('game-heading').textContent = gameType;
    document.getElementById('game-page-img').src = "img/"+gameType+"2.jpg";
    sock.send("displayGame🌴"+gameType);
  }
});

document.getElementById('game-collection').addEventListener('click', (e)=>{
  if(e.target.previousElementSibling){
    var gameNameClicked = e.target.previousElementSibling.textContent;
    var gameClicked;
    for(var i=0; i < storedGames.length; i++){
      var game = storedGames[i];
      if(game.gameName == gameNameClicked){
        gameClicked = game;
      }
    }
    if(gameClicked){
      enterGame(gameClicked.gameName, gameClicked.operation, gameClicked.goal, gameClicked.howToStart, gameClicked.wdh, gameClicked.hgt);
    }else{
      console.log("click button to play");
    }
  }else{
    console.log("click button to play");
  }

});

document.querySelectorAll('.sign-btn').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    console.log(e.target);
    if(loFlag == 0){
      show('Page-Register');
    }else{
      console.log("Login Already");
      show('Page-Account');
    }
  });
});


	function updateProfile(){
		if(flag == 0){
			document.all.UPFN.readOnly = false;
			document.all.UPLN.readOnly = false;
			document.all.UPE.readOnly = false;
			document.all.UPT.readOnly = false;
			document.all.UPW.readOnly = false;
			document.getElementById('Av1').disabled = false;
			document.getElementById('Av2').disabled = false;
			document.getElementById('Av3').disabled = false;
			document.getElementById('Av4').disabled = false;
			document.getElementById('BTN').value = "Update Profile";
			++ flag;
		}
		else{
			-- flag

			var avatar = document.getElementById('curAvatar').src;
			var avatar_idx = avatar.indexOf("nuno-final/");
			if(avatar != -1) avatar = avatar.substr(avatar.length - 17, avatar.length);

			if(aa == document.getElementById('Av1').value || aa == document.getElementById('Av2').value || aa == document.getElementById('Av3').value || aa == document.getElementById('Av4').value){
				avatar = aa;
			}

			var userName = document.getElementById('UPU').value;
			var firstName = document.getElementById('UPFN').value;
			var lastName = document.getElementById('UPLN').value;
			var passWord = document.getElementById('UPRP').value;
			var eMail = document.getElementById('UPE').value;
			var tWitter = document.getElementById('UPT').value;

			var weChat = document.getElementById('UPW').value;
			send("updateProfile🌴"+userName+"🌴"+firstName+"🌴"+lastName+"🌴"+passWord+"🌴"+eMail+"🌴"+tWitter+"🌴"+weChat+"🌴"+avatar);
			document.getElementById('curAvatar').src = avatar;
			document.all.UPFN.readOnly = true;
			document.all.UPLN.readOnly = true;

			document.all.UPE.readOnly = true;
			document.all.UPT.readOnly = true;
			document.all.UPW.readOnly = true;
			document.getElementById('Av1').disabled = true;
			document.getElementById('Av2').disabled = true;
			document.getElementById('Av3').disabled = true;
			document.getElementById('Av4').disabled = true;
			document.getElementById('BTN').value = "Edit";
		}

	}

	function updatePassword(){

		var avatar = document.getElementById('curAvatar');
		var userName = document.getElementById('UPU').value;
		var firstName = document.getElementById('UPFN').value;
		var lastName = document.getElementById('UPLN').value;
		var passWord = document.getElementById('UPRP').value;
		var eMail = document.getElementById('UPE').value;
		var tWitter = document.getElementById('UPT').value;
		var weChat = document.getElementById('UPW').value;


		if(flag_password == 0){
			document.getElementById('UPCP').style.display='block';
			document.all.UPRP.readOnly = false;
			document.getElementById('PAED').value = "Confirm";
			flag_password ++;
		}
		else{
			if(document.getElementById('UPCP').value == document.getElementById('UPRP').value){
				passWord = document.getElementById('UPCP').value;
				send("updateProfile🌴"+userName+"🌴"+firstName+"🌴"+lastName+"🌴"+passWord+"🌴"+eMail+"🌴"+tWitter+"🌴"+weChat+"🌴"+avatar);
				alert("Password has been reset!");
				document.all.UPRP.readOnly = true;
				document.getElementById('UPCP').style.display='none';
				document.getElementById('UPCP').value = "";
				document.getElementById('PAED').value = "Reset Password";
			}
			else{
				document.all.UPRP.readOnly = true;
				alert("Two password is not the same! Try again");
				document.getElementById('UPCP').style.display='none';
				document.getElementById('UPCP').value = "";
				document.getElementById('PAED').value = "Reset Password";
			}
			flag_password--;
		}


	}
	function showp(elementID) {
		if(elementID == "Profile"){
			document.getElementById('Profile').style.display = 'block';
			document.getElementById('Password').style.display = 'none';
		}
		else{
			document.getElementById('Password').style.display = 'block';
			document.getElementById('Profile').style.display = 'none';
		}
	}

/* =================END USER PROFILE END======================= */


/* ====================Register==================== */
	function register(){
		var userName = document.getElementById('REU').value;
		var passWord = document.getElementById('REP').value;
		var email = document.getElementById('REE').value;
		if(userName == "" || passWord == "" || email == ""){
			alert("Please complete the information.");
		}
		else{
			if(document.getElementById('REC').value == document.getElementById('REP').value){
			// alert("register🌴"+userName+"🌴"+passWord+"🌴"+email);
			send("register🌴"+userName+"🌴"+passWord+"🌴"+email);
			}
			else{
				alert("Two passwords are not the same!");
			}
		}

	}

/* ===================End Register End===================== */

/* ===================Login========================== */
	function loGin(){
		var userName = document.getElementById('LOU').value;
		var passWord = document.getElementById('LOP').value;
		if(userName == "" || passWord == ""){
			alert("Please complete the information.");
		}else{
		send("login🌴"+userName+"🌴"+passWord);
		document.getElementById('LOU').value = "";
		document.getElementById('LOP').value = "";

		document.getElementById('SU1').innerHTML = "Account";
		document.getElementById('SU2').innerHTML = "Account";
		document.getElementById('SU3').innerHTML = "Account";
		document.getElementById('SU4').innerHTML = "Account";

		++ loFlag;
    document.querySelectorAll('.sign-btn').forEach(btn=>{
      btn.textContent = 'Account';
      // console.log(btn);
    });
		document.getElementById('logOut').style.display='block';

		}

	}

	function logout(){
		document.getElementById("myAccount").innerHTML="LOGIN";
		document.getElementById("myAccount").onclick=function(){show('Page-Login');}
		document.getElementById('logOut').style.display='none';
		-- loFlag;
		show('Page-Home');
		document.all.UPFN.readOnly = true;
		document.all.UPLN.readOnly = true;
		flag = 0; //信息页归于原始形态.
		document.all.UPE.readOnly = true;
		document.all.UPT.readOnly = true;
		document.all.UPW.readOnly = true;
		document.getElementById('Av1').disabled = true;
		document.getElementById('Av2').disabled = true;
		document.getElementById('Av3').disabled = true;
		document.getElementById('Av4').disabled = true;
		document.getElementById('BTN').value = "Edit";
		flag_password = 0;
		document.all.UPRP.readOnly = true;
		document.getElementById('UPCP').style.display='none';
		document.getElementById('UPCP').value = "";
		document.getElementById('PAED').value = "Reset Password";
		//首页按钮归于初始形态
		document.getElementById('SU1').innerHTML = "Sign Up";
		document.getElementById('SU2').innerHTML = "Sign Up";
		document.getElementById('SU3').innerHTML = "Sign Up";
		document.getElementById('SU4').innerHTML = "Sign Up";
		//Register page recover
		document.getElementById('REU').value = "";
		passWord = document.getElementById('REP').value = "";
		email = document.getElementById('REE').value = "";
		document.getElementById('REC').value = "";

    document.querySelectorAll('.sign-btn').forEach(btn=>{
      btn.textContent = 'Sign Up';
    });
	}

	/* ===================End Login=============== */

/* =================Game Zone================= */

function enterGame(gameName, operation, goal, howToStart, wdh, hgt){

    document.getElementById('GN').textContent = gameName;
    console.log(gameName);
		document.getElementById('GN1').value = "game/" + gameName + ".swf";
		document.getElementById('GN2').value = "game/" + gameName + ".swf";
    document.getElementById('GN3').data = "game/" + gameName + ".swf";

	document.getElementById('GN3').style.width = wdh + "px";
	document.getElementById('GN3').style.height = hgt + "px";
	document.getElementById('GZ').style.width = Number(wdh) + 30 + "px";
	document.getElementById('GZ').style.height = Number(hgt) + 30 + "px";
	document.getElementById('desc').style.left = Number(wdh) - 800 + "px";

    console.log(document.getElementById('GN1'));
    console.log(document.getElementById('GN2'));
		document.getElementById('OM').innerHTML = operation;
		document.getElementById('GG').innerHTML = goal;
		document.getElementById('HTS').innerHTML = howToStart;

    show('Page-GameZone');
}
