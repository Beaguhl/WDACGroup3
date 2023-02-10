<script>
   

   class WishList {
          constructor(itemName, purchased) {
              this.itemName = itemName;
              this.purchased = purchased;
          }
      }
  
    var arrayOfWishes = []
  
    arrayOfWishes.push(new WishList("A horse", "Ricky229")) 
    arrayOfWishes.push(new WishList("5000 $", ""))
    arrayOfWishes.push(new WishList("Food", "")) 
    arrayOfWishes.push(new WishList("A new iPhone", "user_2883"))
  
  document.addEventListener ("DOMContentLoaded", function() {

    // ------------------- following button -------------
    var follow = false
    document.getElementById("follow").addEventListener("click", ToggleFollow)
    
    function ToggleFollow() {
      
      var followOrNot = document.getElementById("follow")
      
      if (follow){
        followOrNot.innerHTML = "Following ✔️"
        follow = false
      } else {
        followOrNot.innerHTML = "✚ Follow"
        follow = true
      }

    }
  })

</script>

<!------------ HTML code ----------->

  <div id="container" class="box">  
    <div class="columns">
    <div class="column">

      <figure class="image" >
        <img id="imgContainer" src="https://preview.redd.it/v0caqchbtn741.jpg?auto=webp&s=c5d05662a039c031f50032e22a7c77dfcf1bfddc" alt="">
      </figure>
      <h5 class="subtitle is-5 followerAndName" id="userName">User Name</h5>
      <div>
        <button class="followerAndName" id="follow"> </button>
      </div>
    </div>
    <div class="column is-one-fifth">
    </div>
    <div class="column">

      <h4 class="subtitle is-4">"user name's" WishList</h4>

      <ul id="wishList">
        {#each arrayOfWishes as item}
          <li id="item">
            <div class="block">
              <div class="columns is-mobile">
                <!------------ item title --------->
                <div class="column is-four-fifths">
                  <p class="has-text-left" id="itemTitle">{item.itemName}</p>
                </div>
                <!------------ + hoverable --------->
                <div class="column">
                    <div class="dropdown is-hoverable is-right">
                      <div class="dropdown-trigger">
                        <p aria-haspopup="true" aria-controls="dropdown-menu4">
                          <!------------ "+" tecknet ska ersättas med ✔️ --------->
                          <!------------ ifall item är purchased --------->
                          <span id="itemDrop" class="has-text-right">✚</span>
                        </p>
                      </div>
                      <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                        <!------------ drowp down content --------->
                        <!------ här ska javascript avgöra vad som ska stå i content ---->
                        <!------ är item purchased ska det stå vem som gjort det -------->
                        <!------ annar ska det stå att man kan köpa den med en check box --------->
                        <div class="dropdown-content">
                          <div class="dropdown-item" id="dropDownContent">                                
                              <label class="checkbox">
                                <input type="checkbox"> I've bought this item</label>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
  

<style>

  #container{
    display: grid;
    grid-template-areas:
    "picture list"
    "nameAndFollow list";
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 2fr 1fr;
  }

  #imgContainer{
    grid-area: picture;
  }

  .followerAndName{
    grid-area: nameAndFollow;
  }

  #follow {
    margin-bottom: 20px;
    margin-top: 20px;
  }

  #username {
    margin-bottom: 70px;
  }

  #profilePic {
    border-radius: 10%;
  }

  #item {
    background-color: rgb(231, 231, 231);
    margin-bottom: 20px;
  
  }

  #itemTitle {
    margin-left: 20px;
  }

  #itemDrop {
    margin-right: 10px;
  }

  #wishList {
    margin-top: 40px;
  }

  #userName {
    margin-top: 20px;
  }

</style>



