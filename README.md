# AMSWeb  

AMSWeb est une application web permettant d'accéder à distance aux données de batteries via notre système de gestion de batteries (AMS).  

## Fonctionnalités  

- **Visualisation des données** : Affiche en temps réel les paramètres clés de la batterie.  
- **Historique des données** : Accès aux données historiques pour analyse.

## Prérequis  

AMSWeb étant une application web statique, il suffit d'un simple serveur web ou d'un navigateur compatible pour l'exécuter.  

## Installation et exécution  

1. **Cloner le dépôt** :  

   ```bash  
   git clone https://github.com/EOSCogniton/AMSWeb.git  
   ```  

2. **Accéder au répertoire du projet** :  

   ```bash  
   cd AMSWeb  
   ```  

3. **Lancer l'application** :  

   - **Méthode 1 (locale, sans serveur web)** :  
     Ouvrez simplement `index.html` dans votre navigateur.  

   - **Méthode 2 (via un serveur web)** :  
     Vous pouvez utiliser un serveur HTTP léger comme celui intégré à Python :  
     ```bash  
     python -m http.server 8000  
     ```  
     Puis ouvrez `http://localhost:8000` dans votre navigateur.  

## Contribution  

Les contributions sont les bienvenues ! Pour proposer des améliorations ou signaler des problèmes :  

1. **Forkez le dépôt**.  
2. **Créez une branche pour votre fonctionnalité ou correction de bug** (`git checkout -b feature/ma-feature`).  
3. **Commitez vos modifications** (`git commit -m 'Ajout de ma nouvelle fonctionnalité'`).  
4. **Poussez vers la branche** (`git push origin feature/ma-feature`).  
5. **Ouvrez une Pull Request**.  

