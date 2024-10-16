import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UserContextService {
	private user: any;
	private userDetails: any;
	private token: any;

	setUser(user: any) {
		this.user = user;
	}

	getUser() {
		return this.user;
	}

	getUserId() {
		return this.user?.sub;
	}

	setUserDetails(userDetails: any) {
		this.userDetails = userDetails;
	}

	getUserDetails() {
		return this.userDetails;
	}

	getUserRoles() {
		return this.userDetails?.roles;
	}

	setUserToken(token: any) {
		this.token = token;
	}

	getToken() {
		return this.token;
	}
}
