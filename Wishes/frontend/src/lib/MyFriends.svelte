<script>

    class User {
          constructor(id, name) {
              this.id = id;
              this.name = name;
          }
      }
  
    var arrayOfUsers = []
  
    arrayOfUsers.push(new User(1, "Ellen")) 
    arrayOfUsers.push(new User(2, "Jocke"))
    arrayOfUsers.push(new User(3, "Aljona")) 
    arrayOfUsers.push(new User(4, "Alma"))
    arrayOfUsers.push(new User(5, "Udo")) 
    arrayOfUsers.push(new User(6, "Loka"))
    arrayOfUsers.push(new User(7, "Callie"))
    arrayOfUsers.push(new User(8, "Sally"))
    arrayOfUsers.push(new User(1, "Ellen")) 
    arrayOfUsers.push(new User(2, "Jocke"))
    arrayOfUsers.push(new User(3, "Aljona")) 
    arrayOfUsers.push(new User(4, "Alma"))
    arrayOfUsers.push(new User(5, "Udo")) 
    arrayOfUsers.push(new User(6, "Loka"))
    arrayOfUsers.push(new User(7, "Callie"))
    arrayOfUsers.push(new User(8, "Sally"))
  
    import {Router, Link, Route} from 'svelte-routing'
    import SpecificUser from "./SpecificUser.svelte";
  </script>
  

    <!----------- search bar ---------->
      <div class="search">
        <input id="search" type="text" placeholder="Search..">
      </div>
      
    <Router>
      <section class="section">
        <div class="container">
            <div class="columns is-multiline is-8 is-variable squareContainer">
              
              {#each arrayOfUsers as user}
                  <div class="column is-4-tablet is-3-desktop square">
                      <section class="container" id="userItem">
                        <Link class="Links" to="/SpecificUser">
                          <div class="profilePicture">
                            <img id="profilePicture" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXm5uazs7OwsLDp6enh4eHl5eW0tLTb29u3t7fe3t7JycnAwMC6urrW1tbMzMzDw8PS0tJ2rmK9AAAFkElEQVR4nO2d3ZqiMAyGoQEBQeH+r3ZBVHZmBWma0C9s36OZM78nzU/T0GaUJRKJRCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSCQSYNBEVpbPP04GUVkNfVvnD+r2OjTZiVSO6q6dcy5fmP5rh/IUGimr+ssPdYvMvK/Ma6Ry6D7Le5qyLWL/xCAou1/W5c0aL41lMw75F30PjVer7khVt0Pf7I43kyLvu+S91mp/i/17PaFipwEXkfXNkh2puvjpe2i82pFIg6cBnxLbMvYv3wldWQJHiZ2R7NgzBY7YyI4BAkeJBuq4IIEj6BLZPmhFIjOK/qSJrWKLRkBgfkGOqJ2AwDzvYPOigBM+cH1sJWs0IvomiQNmtKFWSmHuMKPNTWaNPugQjUi1nMDc3QElSppwBC9lCHrhhOvhjCgWSF+gBRupXPgGzoilZJyZJYJ5YiVsQrhwKr5IRy5QCoVq7h+4KraovynkTQjWXhRO9zM1kEINN8yh6hrhguaJQzrM0BAIlS9KlUWaA5U18vn+AdAuUSWUjgpj63oj0ib9QA3TdKP76RXqpMOk8ECSQi442UJLYYujUCeWAm2flPKhG2ILW1CqaYA2+Tp16QUmlOo0MZACTaazP0TaHmak0GrDaglTr6AQqRGlkhCBsuGEyJjJL4VIbjgi32yD6rRlGjkfq6mvEU0d2ICbQr7orlDrVKPr7aBcsWDMrn+XCJQw5A+50RTqbJ/+A4VASV9pCwxUe6soRFqkWaEgEGqP/z9sLhTSBVhhqmBEh7RIMwVPhBvdEy+9cY5lXkgnDCwvnCBZgVDN0hnZWAO1cXoh2vjG/PhJMiVCNUtfSJ6TOkA3zGRPoCAXaZa1YhJRrx+QatbgftJNIlnfdbACZYIN7veVM3WoRPx7FXxubflkQbBe/gfCJk/A9vUrhARUqNbMGiEVOFKDdIsAE8b+6fvge6IVE/I3GVDzJVuwSxvMDcVHeMeldhYpdx8FepPCR3hn3iaS4QvWBBHOJzI7YA26tbF/tRcMI9qoSd8wPBH1Vpo1/MMpZBN4A/8DRbDzwq/4NzQspcMH/svUmkL/ZWpNofeRqTU/9HdEa7HUv5thLR/6b/WN1TScZoatupTTczO1e8pYKd9YMPUfsLHmiIzDRMjD+3UYvRpby5R1lIg2yrYJaxzTTEt4gtUVthRruKOKZvYX3MY+3FDpOtxjUoc6SfOLgJkMG6VbyFwN6ETbL5qQo3wLJ1CBXybgu2L4pxfYMzVUCAzSIkukSmRSGLdlQ4OEvql8i63kMxT8yswisSsAzUi3PY/l7dYIt1KpkRuCniW2UGakQv5GM3fBuQqLml5ygS4aW4iBaKKq3XhsNFBj9CcuiYp78OTzpsRxqcbTOMob9Mz31thFOpQiaob221uxYhqPNiNRdrvWKsEFQCNl5e33K9RHaKwPeuWamgjqXhrv+iXAmBcOXJr/asz7SjWwTnkvnrynyMmQSiLF604mznUqHkml0k26HJxr5R+6Ho7JfLtx9VWyZKUCY4H+wOXtTcojZXe2goweKaNRrDUhj8QW0v+Z9GMJrudYz6QfS1i3Y3RBfNyFb0atpzmkYbdXtV7mkMfxZuLsCJwCDuNk1coSnWFItCWQIZGU3nDSw3l+GaZyT6AunqMqKleuKuMzAkDAtegG+0cArEWZhb2jf+LPFx/G3mij8ZjDMeybbrRUy/zDrjljnTdVjqLeYUKVR0UPY8c6VbrX+Ti+TuHaDTMz33ZSdlPhmy/BRueG/GPZHFE9gQm/fNSg8nLT0WxW4LZz4YuND6hMlzMLG5/20wniTL459afwMlUUVqPpKSLpxOpFy8ZL0oXVZVrCH8PsZW0nbK6DuMpKND2NG64mfZWHGiPxeZmWZyjZnvxVm/4B5UtbNplkcc8AAAAASUVORK5CYII=" alt="Placeholder image">                                        
                          </div> 
                          
                          <div class="text">{user.name}</div>    
                          
                        </Link> 
                      </section>   
                  </div> 
                {/each}

            </div>
        </div>
      </section>

      <main>
        <Route path="/SpecificUser" component="{SpecificUser}"></Route>
      </main>
    </Router>
    

  
  
  <style>
    /*#userItem {
    background-color: rgba(94, 127, 132, 0.418);
    padding-bottom: 30px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 25px;
    border-radius: 25px;
  }*/
  
    .profilePicture{
      margin-top: 10%;
      display: flex;
      justify-content: center;
    }

    #profilePicture {
      border-radius: 10%;
      width: 100%;
      padding-left: 10px;
      padding-right: 10px;
    }

    .container{
      grid-template-rows: 1fr 1fr;
      color: black;
    }

    .container :hover {
      color: rgb(151, 28, 172);
    }

    .text{
      display: flex;
      justify-content: center;
      margin-top: 4%;
      font-size: x-large;
      font-weight: bolder;
      color: black;
    }

   

    .squareContainer{
		display: grid;
		height: 70vh;
		width: 100vw;
		grid-template-areas: 
		"topLeft topMidLeft topMidRight topRight"
		"midLeft midMidLeft midMidRight midRight"
		"botLeft botMidLeft botMidRight botRight";
		grid-template-rows: 10fr 10fr 10fr 1fr;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		grid-gap: 5%;
		float: left;
	}

	.square{
		width: 85%;
		height: 100%;
		border-radius: 20px;
		z-index: 2;
		box-shadow: 5px 5px 5px 2px;
		margin-bottom: 5%;
		margin-left: 6%;
		margin-right: 2%;
    background-color: rgba(94, 127, 132, 0.418);
	}

    #search {
      padding: 6px;
      border: none;
      margin: 3%;
      font-size: 17px;
      background-color: blue;
      border-radius: 10px;
    }

    .search {
      text-align: center;
    }



  </style>