import React, { Component } from 'react';
import Modal from 'react-modal';

export class ListContainer extends Component {
  constructor(props) {
    super(props);
    // recipes: title, first ingredient, second ingredient, ...
    this.state= {
      recipes: [
        {index: 0, title:'Kapuszta', ingredients: ['Cabbage', 'Onions', 'Apples', 'Bacon', 'Brown Sugar']},
        {index: 1, title: 'Apple Crisp', ingredients: ['Apples', 'Oats', 'Butter','Brown Sugar']},
        {index: 2, title: 'Slowcooker Bratwurst', ingredients: ['Bratwurst', 'Onions', 'Beer']}
      ],
      modalIsOpen: false,
      newTitle: '',
      newIngredients: '',
    }

    this.deleteRecipe= this.deleteRecipe.bind(this);
    this.editRecipe= this.editRecipe.bind(this);
    this.addRecipe= this.addRecipe.bind(this);
  }

  // Modal Functions
    openModal() {
      this.setState({modalIsOpen: true});
    }

    closeModal(self) {
      self.setState({modalIsOpen: false});
    }

    getParent() {
      return document.querySelector('#root');
    }

  // Edit Functions
    handleChange(e, value) {
      var type= value;

      if (type === 'title') {
        this.setState({
          newTitle: e.target.value
        }, function(){
          return this.state.newTitle;
        });
      } else {
        this.setState({
          newIngredients: e.target.value
        }, function () {
          return this.state.newIngredients;
        });
      }
    }

    handleRecipe(e, value) {
      e.preventDefault(); 
      var type = value;
      var id= type === "new" ? this.props.recipes.length+1 : this.props.recipe['index'];

      this.setState({
        newRecipe: {
          index: id,
          title: this.state.newTitle === ''? this.props.recipes[id]['title'] : this.state.newTitle,
          ingredients: this.state.newIngredients === ''? this.props.recipes[id]['ingredients'] : this.state.newIngredients.split(',')
        }
      }, function() {
        
        if (type === "new") {
          this.props.addRecipe(this.state.newRecipe);
        } else {
          this.props.editRecipe(this.state.newRecipe);
        }
      });

      this.props.closeModal(this);
    }

  // Update Functions
    editRecipe(recipe) {
      var id= recipe['index'];
      var recipesObj= [];
      
      for(var i in this.state.recipes) {
        if (this.state.recipes[i]['index'] === id) {
          recipesObj.push(recipe);
        } else {
          recipesObj.push(this.state.recipes[i]);
        }
      }

      recipesObj.sort(function (a, b) {
        return a.index - b.index;
      });

      this.setState({
        recipes: recipesObj
      }, function(){
        return this.state.recipes;
      });
    }

    deleteRecipe(e, value) {
      var self= this;
      var id= value;
      var newRecipes= [];

      for(var i=0; i< self.state.recipes.length; i++) {
        if (self.state.recipes[i]['index'] !== id) {
          newRecipes.push(self.state.recipes[i]);
        }
      }

      this.setState({
        recipes: newRecipes
      }, function(){
        return this.state.recipes;
      });
    }

    addRecipe(recipe) {
      var box= this.state.recipes;
      var len= this.state.recipes.length;
      box[len]= recipe;

      this.setState({
        'recipes': box
      }, function(){
        return box;
      });
    }

  render() {
    var self= this;
    const recipes= this.state.recipes;
    
    return (
      <section>
        <h1>Recipe Box</h1>

        <section id="recipeList">
          {Object.keys(recipes).map(function(key) {
            return (
              <Recipe 
                key={key} 
                recipe={recipes[key]} 
                recipes={self.state.recipes}
                handleChange={self.handleChange}
                handleRecipe={self.handleRecipe}
                editRecipe={self.editRecipe}
                deleteRecipe={self.deleteRecipe}

                openModal={self.openModal}
                closeModal={self.closeModal}
                getParent={self.getParent} 
              />
            );
          })}
        </section>

        <Add 
          recipes={this.state.recipes}
          handleChange={this.handleChange}
          handleRecipe={this.handleRecipe}
          addRecipe={this.addRecipe}

          openModal={this.openModal}
          closeModal={this.closeModal}
          getParent={this.getParent}
        />
      </section>
    );
  }
}

class Recipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTitle: '',
      newIngredients: '',
      id: this.props.recipe.index,
      newRecipe: ''
    };
  }

  render() {
    const recipeTitle = this.props.recipe.title;
    const index= this.props.recipe.index;
    const ingredients= this.props.recipe.ingredients;
    const generateHandler = (value, method) => e => method(e, value);

    return (
      <article>
        <header>
          <h2>{recipeTitle}</h2>
        </header>

        <div className="recipeBody">
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((obj, i)=><li key={i}>{obj}</li>)}
          </ul>
        </div>

        <div className="controls">
          <button 
            className="delete"
            onClick={generateHandler(this.props.recipe.index, this.props.deleteRecipe)}
          >Delete</button>

          <button 
            className="update" 
            onClick={this.props.openModal.bind(this)}
          >Edit</button>
        </div>
      

        <Modal 
          isOpen={this.state.modalIsOpen}
          parentSelector={this.props.getParent}
        >
          <article id="modal">
            <form acceptCharset="utf-8">
              <fieldset>
                <legend>Recipe</legend>

                <label htmlFor="name">Recipe Name:</label>
                <input 
                  required
                  type="text"
                  value={this.state.newTitle? this.state.newTitle : this.props.recipe.title} 
                  placeholder={this.props.recipe.title}
                  onChange={generateHandler('title', this.props.handleChange.bind(this))}
                />

                <label htmlFor="ingredients">Ingredients:</label>
                <input
                  required
                  type="text"  
                  value={this.state.newIngredients? this.state.newIngredients : this.props.recipe.ingredients} 
                  placeholder={this.props.recipe.ingredients}
                  onChange={generateHandler('ingredients', this.props.handleChange.bind(this))}
                />

                <button
                  type="button" 
                  id={index} 
                  onClick={generateHandler('edit',this.props.handleRecipe.bind(this))}
                >Save Recipe</button>

                <button 
                  type="button" 
                  id={index} 
                  onClick={this.props.closeModal.bind(this)}
                >Cancel</button>

              </fieldset>
            </form>
          </article>
        </Modal>
      </article> 
    )
  }
}

class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTitle: '',
      newIngredients: '',
      newRecipe: ''
    };
  }

  render() {
    const generateHandler = (value, method) => e => method(e, value);

    return (
      <section>
        <button type="button" onClick={this.props.openModal.bind(this)}>Add</button>

        <Modal 
          isOpen={this.state.modalIsOpen}
          parentSelector={this.props.getParent}
        >
          <article id="modal">
            <form acceptCharset="utf-8">
              <fieldset>
                <legend>Add a New Recipe</legend>

                <label htmlFor="name">Recipe Name:</label>
                <input 
                  required
                  type="text"
                  ref="new" 
                  value={this.state.newTitle? this.state.newTitle : ''}  
                  placeholder="Enter recipe's name"
                  onChange={generateHandler('title', this.props.handleChange.bind(this))}
                />

                <label htmlFor="ingredients">Ingredients:</label>
                <input
                  required 
                  type="text" 
                  ref="new" 
                  value={this.state.newIngredients? this.state.newIngredients : ''}  
                  placeholder="Enter ingredients,separated,by,commas"
                  onChange={generateHandler('ingredients', this.props.handleChange.bind(this))}
                />

                <button
                  type="submit" 
                  onClick={generateHandler('new',this.props.handleRecipe.bind(this))}
                >Add</button>

                <button 
                  type="button"
                  onClick={this.props.closeModal.bind(this)}
                >Cancel</button>
              </fieldset>
            </form>
          </article>
        </Modal>
      </section>
    )
  }
}

export default ListContainer;