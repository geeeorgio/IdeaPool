import React, { Component } from 'react';
import RetinaImage from 'react-retina-image';
import shortid from 'shortid';
import IdeaForm from './IdeaForm';
import Idea from './Idea';
import { pageOfIdeas } from '../api'

class Main extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
    		ideas : [],   	     
     	}
     	this.newIdea = this.newIdea.bind(this);
     	this.ideaEdit = this.ideaEdit.bind(this);
        this.ideaCreate = this.ideaCreate.bind(this);
        this.ideaUpdate = this.ideaUpdate.bind(this);
        this.ideaDelete = this.ideaDelete.bind(this);
        this.closeForm = this.closeForm.bind(this);                
    }

    pullIdeas() {  
    	let self = this;
        (function pull(page = 1) {	
    	    pageOfIdeas(page,reply => {
    	        if (reply.res && reply.res.length > 0) {
    	            let list = reply.res.map(i => ({ record: {...i}, fresh: false, edit: false }))
    		        self.setState({ ideas: list } ,() => pull(page + 1))    	   
    	        }  
    	    });
    	})();   
    }    

    componentDidMount() {
      	this.pullIdeas();    
    }

    newIdea(event) {
		event.preventDefault();
		const idea = {
			fresh: true,
			edit: true,
			record: {
				id: shortid.generate()
			}
		}
		this.setState(prevState => ({
			ideas: [idea, ...prevState.ideas]
		}))
	}

    ideaCreate(param) {
    	let list = this.state.ideas;
    	list.forEach((idea,idx) => {
    		if (idea.record.id === param.oldId) {
    			let newidea = { fresh: false, edit: false, record : param }
    			list.splice(idx,1,newidea)
    		}
    	})
        this.setState({ ideas: list })
    }

    ideaUpdate(item) {
        let list = this.state.ideas;
        list.forEach((idea,idx) => {
            if (item.id === idea.record.id) { 
                let copy = { fresh: false, edit: false, record: item};                     
            	list.splice(idx,1,copy)
            }
        })
        this.setState({ ideas: list })
    }

    ideaEdit(id) {	
        let list = this.state.ideas;
        list.forEach((idea,idx) => { 
            if (idea.record.id === id) {
            	let copy = { fresh: false, edit: true, record: idea.record};
            	list.splice(idx,1,copy)
            }
        })	
		this.setState({ ideas: list })
	}

    ideaDelete(id) {
    	this.setState(prevState => ({
            ideas: prevState.ideas.filter(idea => idea.record.id !== id )  
        }));
    }

    closeForm(id) {
		let list = this.state.ideas;
        list.forEach((idea,idx) => {
            if (id === idea.record.id) {            
            	let copy = idea;
            	if (copy.fresh) {
            		list.splice(idx,1)
            	} else {
                    copy.edit = false;
                    list.splice(idx,1,copy)
                }
            }
        })
        this.setState({ ideas: list })
    }

	render() {
		const items = this.state.ideas.map((item, i) => {
			if(item.edit){
				return <IdeaForm	
					key={item.record.id}
					data={item.record}
					fresh={item.fresh}
					onAbort={this.closeForm}
					onCreate={this.ideaCreate}
					onUpdate={this.ideaUpdate}
				/>
			}
			else {
				return <Idea key={item.record.id} onEdit={this.ideaEdit} data={item.record}	onRemove={this.ideaDelete} />
			}
		})
    return (
			<div className="content-container">
				<header className="page-header">
					<h1 className="page-title">My Ideas</h1>
					<RetinaImage className="add-idea-btn" onClick={this.newIdea} src={process.env.PUBLIC_URL + '/images/btn_addanidea.png'} alt=""/>
				</header>
				{this.state.ideas.length > 0 ? (
					<div className="results">
						<table>
							<thead>
								<tr>
									<th></th>
									<th>Impact</th>
									<th>Ease</th>
									<th>Confidence</th>
									<th>Avg.</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{items}
							</tbody>
						</table>
					</div>
				) : (
					<div className="empty-results">
						<div className="empty-results-message">
							<RetinaImage src={process.env.PUBLIC_URL + '/images/bulb.png'} alt=""/>
							<div>Got Ideas?</div>
						</div>
					</div>
				)}
			</div>
    );
  }
}

export default Main;
