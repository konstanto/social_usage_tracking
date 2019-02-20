import "./Layout.less";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Tracking } from "./models/Tracking";
import Api from "./services/Api";

interface TrackerState extends Tracking {
	hasSubmitted: boolean;
}

class Tracker extends React.Component<{}, TrackerState> {
	public constructor(props: {}) {
		super(props);

		const url = new URL(window.location.href);

		this.state = {
			smsSendoutDateTime: url.searchParams.get("smssendtime"),
			partitipantId: url.searchParams.get("parid"),
			workplace: null,
			workplaceDescription: "",
			facebook: null,
			facebookDescription: "",
			hasSubmitted: false,
			location: {
				work: false,
				home: false,
				travelling: false,
				other: false
			}
		}
	}

	private setNewState(name: string, newValue: string | boolean) {
		const oldState = { ...this.state };
		oldState[name] = newValue;
		this.setState(oldState);
	}

	private toggleNewStateCheckbox(name: string) {
		const oldState = { ...this.state };
		oldState.location[name] = !oldState.location[name];
		this.setState(oldState);
	}

	private async submitAnswer(e: any) {
		e.preventDefault();
		await new Api.Tracker().postTracking(this.state);
		this.setState({ hasSubmitted: true });
	}

	public render() {
		if (this.state.hasSubmitted === true) {
			return (
				<div className="layout">
					<div className="ku-logo"></div>
					<h1>Mange tak</h1>
					<p>Din besvarelse er nu sendt</p>
				</div>
			)
		}

		return (
			<div className="layout">
				<div className="ku-logo"></div>
				<form onSubmit={(e) => { this.submitAnswer(e) }}>
					<h1>Forbrug siden sidste måling</h1>

					<div className="social-media-group">
						<p>Har du brugt Workplace?</p>
						<div className="buttons">
							<button type="button" className={this.state.workplace === true ? "selected" : null} onClick={() => { this.setNewState("workplace", true) }}>Ja</button>
							<button type="button" className={this.state.workplace === false ? "selected" : null} onClick={() => { this.setNewState("workplace", false) }}>Nej</button>
						</div>
						{this.state.workplace === true ?
							<>
								<div className="buttons">
									<textarea value={this.state.workplaceDescription} onChange={(field) => { this.setNewState("workplaceDescription", field.target.value) }} placeholder="Hvad har du lavet?"></textarea>
								</div>
							</>
							: null}
					</div>
					<div className="social-media-group">
						<p>Har du brugt Facebook?</p>
						<div className="buttons">
							<button type="button" className={this.state.facebook === true ? "selected" : null} onClick={() => { this.setNewState("facebook", true) }}>Ja</button>
							<button type="button" className={this.state.facebook === false ? "selected" : null} onClick={() => { this.setNewState("facebook", false) }}>Nej</button>
						</div>
						{this.state.facebook === true ?
							<>
								<div className="buttons">
									<textarea value={this.state.facebookDescription} onChange={(field) => { this.setNewState("facebookDescription", field.target.value) }} placeholder="Hvad har du lavet?"></textarea>
								</div>
							</>
							: null}
					</div>

					<div className="location-group">
						<p>Hvor har du været i denne periode?</p>
						<div className="buttons">
							<label htmlFor="work">Arbejde <input id="work" type="checkbox" checked={this.state.location.work} onChange={() => { this.toggleNewStateCheckbox("work") }} /></label> 
							<label htmlFor="home">Hjemme <input id="home" type="checkbox" checked={this.state.location.home} onChange={() => { this.toggleNewStateCheckbox("home") }} /></label> 
							<label htmlFor="travelling">Transport <input id="travelling" type="checkbox" checked={this.state.location.travelling} onChange={() => { this.toggleNewStateCheckbox("travelling") }} /></label> 
							<label htmlFor="other">Andet <input id="other" type="checkbox" checked={this.state.location.other} onChange={() => { this.toggleNewStateCheckbox("other") }} /></label> 
						</div>
					</div>
					<button type="submit">Send</button>
				</form>
			</div>
		)
	}
}

ReactDOM.render(((<Tracker />)), document.getElementById("app"));