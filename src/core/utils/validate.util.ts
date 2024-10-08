const validateEmail = (email: string) => {
	const wildcard = 'notiene@gmail.com';

	try {
		if (!email) {
			return { status: false, message: 'No hay correo por validar.' };
		}

		if (wildcard === email) {
			return { status: true, message: '' };
		}

		if (
			!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
				email.toString(),
			)
		) {
			return {
				status: false,
				message: 'La estructura del correo es invalida.',
			};
		}

		return { status: true, message: '' };
	} catch (error) {
		return { status: false, message: 'Error al procesar la validación.' };
	}
};

export { validateEmail };
