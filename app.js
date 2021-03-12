
// ------- Intialisation des variables et fonctions de base ------------------------

let nbCasesJouees = 0
let currentPlayer = 1
let p1
let p2
let nombreParties = 0
let v1 = 0
let v2 = 0
let draw = 0
let root = document.querySelector(":root")
let cells = document.querySelectorAll(".cell")
let form = document.querySelector("form")
let endgame = document.querySelector("#endgame")

// --------------------------------------------------------------------------------


// ------ FORMULAIRE POUR LES NOMS + INITIALISATION ------------------------------

form.addEventListener("submit", (event) => {
    if(confirm("Etes-vous sûrs de vouloir démarrer avec ces noms-là ?"))
        submitForm(event)
})

function submitForm(event){
    event.preventDefault()

    // Affecte la valeur des champs dans deux variables JS
    p1 = document.querySelector("#nomJ1").value
    p2 = document.querySelector("#nomJ2").value

    // Affectation des variables JS aux variables CSS correspondantes (utile pour l'affichage).
    // Pour les champs laissés vide (value = ""), on laisse les valeurs par défaut initiées
    // dans la feuille de style.
    if(p1 !== ""){
        root.style.setProperty("--dujoueur1", "'de '" + "'" + p1 + "'") // variable pour afficher "Au tour DE ..."
        root.style.setProperty("--nomjoueur1", "'" + p1 + "'")  // variable pour afficher le nom sans déterminant devant
    }
    if(p2 !== ""){
        root.style.setProperty("--dujoueur2", "'de '" + "'" + p2 + "'") // Idem pour le Joueur 2
        root.style.setProperty("--nomjoueur2", "'" + p2 + "'")
    }
    for(const cell of cells){
        cell.addEventListener("click", playerMove)
    }

    // On démarre le jeu en supprimant complètement le formulaire afin que personne ne puisse
    // tricher et changer les noms en cours de jeu.
    form.parentElement.removeChild(form)
}

// -------------------------------------------------------------------------------


function playerMove(){
    let isLibre = this.classList.contains("libre")
    if(isLibre){    // permet d'effectuer les actions uniquement si la case cliquée est vide
        nbCasesJouees ++
        let symbole = (currentPlayer == 1) ? "cross" : "round"
        this.classList.remove("libre")
        this.classList.add(symbole)
        this.innerHTML = "<img src='img/" + symbole + ".png'>"

        isVictory() // regarde si le move du joueur actif lui permet de gagner la partie

        // permet de changer de joueur actif, même en cas de victoire
        let change = document.querySelector(".player" + currentPlayer)
        change.classList.remove("player" + currentPlayer)
        currentPlayer = (currentPlayer == 1) ? 2 : 1
        change.classList.add("player" + currentPlayer)
    }
    else alert("Clique sur une case vide, putain !")
    
}

function isVictory(){
    // On crée un tableau de STRING qui contient le nom de toutes les classes définissant
    // une coordonnée précise (l1 pour ligne 1, c1 pour colonne 1, etc...).
    // Ce tableau nous permettra de boucler sur les trois cases d'une même rangée.
    nomsRangees = ["l1", "l2", "l3", "c1", "c2", "c3", "d1", "d2"]

    for(nomRangee of nomsRangees){
        // on récupère la nodelist relative à une rangée précise grace au tableau
        let rangee = document.querySelectorAll("." + nomRangee)
        var crosscount = 0
        var roundcount = 0
        // dans chaque nodelist, on regarde combien de cases comportent le même symbole
        // et on incrémente la variable qui y est associée.
        for(cell of rangee){
            if(cell.classList.contains("cross")){
                crosscount++
            }
            // ici, un else if est nécessaire car on ne veut pas que la classe .libre
            // incrémente roundcount comme les tests n'attendent pas que toutes les
            // cases soient remplies
            else if(cell.classList.contains("round")){
                roundcount++
            }
        }
        // Les tests suivants permettent d'afficher un écran de fin si toutes les cases
        // d'une rangée, diagonales comprises dans les tests, ont le même symbole (la même
        // classe .cross ou .round)
        if(crosscount === 3){
            v1++    // incrémentation du score de victoire. v1 pour joueur 1 et v2 pour joueur 2
            root.style.setProperty("--v1", "'" + v1 + "'")
            endgame.classList.add("p1win")  // affichage du vainqueur grâce à des classes CSS prédéfinies
            affichageEndGame()  // appel de la fonction qui gère la fin d'une partie
        }
        else if(roundcount === 3){
            v2++
            root.style.setProperty("--v2", "'" + v2 + "'")
            endgame.classList.add("p2win")
            affichageEndGame() 
        }                     
    }
    // teste si toutes les cases sont remplies et qu'aucune victoire n'est à déclarer
    if((crosscount != 3 || roundcount != 3) && nbCasesJouees === 9){
        draw++  // incrémentation de la variable qui compte le nombre de nuls
        root.style.setProperty("--draw", "'" + draw + "'")
        endgame.classList.add("draw")   // affichage relatif au nul grâce au CSS
        affichageEndGame()
    }
}


// FONCTION SPECIALE PERMETTANT DE SUPPRIMER LES EVENTS CLICKS SUR DES ELEMENTS DONT
// ON EN A DEFINIT. ATTENTION, CETTE FONCTION NE PREND QUE DES NODELIST.
// C'est juste un raccourcit. Une fonction pour supprimer l'event d'UN seul élément
// étant INUTILE, il n'y a pas lieu d'en créer une.
function removeClick(liste, fonction){
    for(element of liste){
        element.removeEventListener("click", fonction)
    }
}


// -------- FUNCTIONS RELATIVES A LA FIN DU JEU -------------------------------------

function affichageEndGame(){
    nombreParties++
    nbCasesJouees--
    root.style.setProperty("--nombreParties", "'" + nombreParties + "'")

    // Désactivation des clicks cellule et affichage de l'écran de fin. La réactivation de
    // cette fonctionnalité se fait à chaque réinitialisation de grille dans la fonction
    // nettoyerGrille(). Alors pas de panique !
    removeClick(cells, playerMove)
    endgame.classList.add("dispblock")
    endgame.addEventListener("click", onClickEndgame)
}

function onClickEndgame(){
    nettoyerGrille()

    this.classList.remove("dispblock")

    // Effaçage de toutes les classes affichant un gagnant ou un nul
    // la méthode classList.remove() ne renvoie pas d'erreur si la classe n'y est pas
    this.classList.remove("p1win")
    this.classList.remove("p2win")
    this.classList.remove("draw")

    // on enlève l'event click du Endgame pour éviter les petits malins qui désactivent son
    // display:none pour courcircuiter tout ce qui est prédit pour le bon fonctionnement du
    // jeu. Oui, oui, on va éviter de pouvoir cliquer dessus en milieu de partie pour éviter
    // l'incrémentation de victoire de l'adversaire. Mort aux cheaters ! White hackers, vous
    // êtes épargnés, bien évidemment !
    endgame.removeEventListener("click", onClickEndgame)
}

// Si une telle fonction existe plutôt que de simplement implémenter ses instructions
// dans la fonction onClickEndgame(), c'est pour pouvoir réutiliser son fonctionnement dans
// des boutons pour abandonner la partie chez le joueur un, ou deux, et qui incrémentera le
// score de l'autre joueur.
function nettoyerGrille(){ 
    for(cell of cells){

        // efface les classes .round et .cross de la partie précédente et remet la classe .libre
        // pour toutes les cellules de la grille
        cell.classList.remove("cross")
        cell.classList.remove("round")
        cell.classList.add("libre")

        // permet de retirer les images croix et rond présentes à cause de l'ancienne partie
        cell.innerHTML = ""

        // réinitialisation du nombre des cases jouées
        nbCasesJouees = 0

        // permet aux joueurs de recliquer sur les cases.
        // cet event était rétiré des cases en cas de victoire.
        // Vous voyez, les clicks sur cases sont de retour :)
        cell.addEventListener("click", playerMove)
    }
}
