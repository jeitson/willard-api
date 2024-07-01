export const RESPONSE_SUCCESS_CODE = 200;
export const RESPONSE_CUSTOMER_ERROR_CODE = 400;
export const RESPONSE_SERVER_ERROR_CODE = 500;

export const RESPONSE_SUCCESS_MSG = 'success';

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
	// json
	JSON = 'application/json;charset=UTF-8',
	// form-data qs
	FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
	// form-data  upload
	FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
