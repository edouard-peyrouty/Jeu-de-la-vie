from tkinter import *
from functools import partial

def init_window():
    """Crée la page Tkinter du jeu
    return (Tkinter,list[list[Button]]) : Page Tkinter du jeu, tableau en 2 dimensions des bouttons formant la grille"""
    # création de la fenêtre vierge
    window = Tk()
    window.minsize(800,800)
    # création boite contenant les boutons de la grille
    grid_frame = Frame(window)
    # création de la liste en 2 dimensions des boutons formant la grille ainsi que des dits boutons.
    grid = [[Button(grid_frame,relief="raised",bd=1,width=3,height=1,bg="white",fg="white",command=partial(button_clicked,row,column)) for column in range(size)] for row in range(size)]
    # placement des boutons dans la grille
    for row in range(len(grid)):
        for column in range(len(grid)):
            grid[row][column].grid(row=row,column=column)
    # placmement de la grille
    grid_frame.pack(expand=1)
    # création et placement d'un bouton permettant de passer à l'étape suivante
    Button(window,text="next step",command=next_step).pack(expand=True)    
    return window,grid

def button_clicked(row,column):
    """changement de l'état d'un bouton de la grille (noir -> blanc ou blanc -> noir)
    row (int) : indice de la ligne du bouton
    column (int) : indice de la colonne du bouton"""
    grid[row][column].config(bg="black",fg="black") if grid[row][column]["bg"] == "white" else grid[row][column].config(bg="white",fg="white")
    
def next_step():
    """ Passage de la grille à l'étape suivante"""
    # Comptabilisation du nombres de cellules voisines vivantes pour chaque case
    for row in range(len(grid)):
        for column in range(len(grid)):
            update_neighbours(row,column)
    # Mise à jour de l'état de chaque case en fonction du nombre de cellules voisines vivantes
    for row in grid:
        for button in row:
            # Si la cellule "nait"
            if button["bg"] == "white" and button["text"] == "3":
                button.config(bg="black",fg="black")
            # Si la cellule "meurt"
            if button["bg"] == "black" and button["text"] not in ["2","3"]:
                button.config(bg="white",fg="white")
           
def update_neighbours(row,column):
    """ Compte pour une case donnée le nombre de cellules voisines vivantes
    row (int) : indice de la ligne case
    column (int) : indice de la colonne de la case 
    """
    # compteur du nombre de voisines vivantes
    nb_neigh = 0
    # On parcours les lignes directement voisines à la case
    for i in range(row-1,row+2):
        # on évite les erreurs de bords
        if 0 <= i < len(grid):
            # on parcours les colonnes directement voisines à la case 
            for j in range(column-1,column+2):
                # on évite les erreurs de bord
                if 0 <= j < len(grid):
                    # on incrémente le compteur si la cellule est voisine et vivante
                    nb_neigh += 1 if (i,j) != (row,column) and grid[i][j]["bg"] == "black" else 0
    # on stocke le résultat dans le texte du bouton représentant la case
    grid[row][column]["text"] = str(nb_neigh)    

if __name__ == "__main__":
    # taille de la grille (nombre de case par ligne)
    size = 16
    # création de la page
    window,grid = init_window()
    # affichage de la page
    window.mainloop()