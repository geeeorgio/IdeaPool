import React, { Component } from 'react';
import RetinaImage from 'react-retina-image';
import shortid from 'shortid';
import { createIdea, updateIdea } from '../api';

class IdeaForm extends Component {
  constructor(props) {
    super(props);
		let state;
		if(props.fresh){
			state = {
				id: props.data.id,
				content: '',
				impact: 1,
				ease: 1,
				confidence: 1,
				average_score: '',
			}
		}
		else {
			state = props.data;
		}
		this.state = state;
		this.state.updating = false;
		this.submit = this.submit.bind(this);
		this.abort = this.abort.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	create() {
		let param = {
			oldId: this.state.id,
			content: this.state.content,
			impact: this.state.impact,
			ease: this.state.ease,
			confidence: this.state.confidence,
		}
		createIdea(param, (reply) => {
		    if(reply.res) {		    	
		    	this.setState({
				    average_score: reply.res.average_score,
				    id: reply.res.id, 
			}, () => {
				param.average_score = this.state.average_score
				param.id = this.state.id;
				this.props.onCreate(param);	
			    })
		    }    
		})					
	}

	update() {
		let param = {
			content: this.state.content,
			impact: this.state.impact,
			ease: this.state.ease,
			confidence: this.state.confidence,
		};
		let id = this.state.id;
		updateIdea(param, id, (reply) => {
		    if (reply.res) {
			    this.setState({ average_score: reply.res.average_score }, () => {
				    param.average_score = this.state.average_score
				    param.id = this.state.id;
				    this.props.onUpdate(param);
			    })
		    }
	    })
	}

	abort(event) {
		event.preventDefault();
		this.props.onAbort(this.state.id);
	}

	submit(event) {
		event.preventDefault();
		this.setState({ updating: true })
		this.props.fresh ? this.create() : this.update();		
	}

    handleInputChange(event) {
	    const t = event.target;
	    const value = t.type === 'checkbox' ? t.checked : t.value;
	    const name = t.name;

	    this.setState({
	    	[name]: value
	    });
    }

    render() {
        const options = Array(10).fill().map((_,i) => 
            <option key={shortid.generate()} value={i+1}>{i+1}</option>);
        const disabledAttribute = this.state.updating ? {disabled: 'disabled'} : {}

    	return (
            <tr>
                <td colSpan='6'>
                    <form onSubmit={this.submit}>
            	       <table className="table">
            	           <tbody>
            	                <tr>
									<td>
										<input type="text" name="content" value={this.state.content} onChange={this.handleInputChange} required/>
									</td>
									<td>
										<select name="impact" value={this.state.impact} onChange={this.handleInputChange}>
											{options}
										</select>
									</td>
									<td>
										<select name="ease" value={this.state.ease} onChange={this.handleInputChange}>
											{options}
										</select>
									</td>
									<td>
										<select name="confidence" value={this.state.confidence} onChange={this.handleInputChange}>
											{options}
										</select>
									</td>
									<td>{Math.round(this.state.average_score*100)/100}</td>
									<td className="table-controls">
										<button {...disabledAttribute }>
											<RetinaImage src={process.env.PUBLIC_URL + '/images/Confirm_V.png'} alt=""/>
										</button>
										<button {...disabledAttribute }>
											<RetinaImage src={process.env.PUBLIC_URL + '/images/Cancel_X.png'} alt="" onClick={this.abort}/>
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</form>
				</td>
            </tr>
    	)
    }

}

export default IdeaForm;
