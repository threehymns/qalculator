import { setOption } from './calculatorModule';

export enum AngleUnit {
	None = 0,
	Rad = 1,
	Deg = 2,
	Grad = 3,
}

export class Settings {
	angleUnit = AngleUnit.Rad;

	useUnits = true;

	useUnitPrefixes = true;

	useDecimalPoint = false;

	additionalOptions = '';

	load() {
		if (typeof window === 'undefined') return;
		const savedSettings = window.localStorage?.getItem(
			'qalculator-settings',
		);
		if (!savedSettings) return;
		const settings = JSON.parse(savedSettings);

		if (
			settings.angleUnit === undefined ||
			Number.isNaN(+settings.angleUnit) ||
			+settings.angleUnit < 0 ||
			+settings.angleUnit > 3
		) {
			this.angleUnit = AngleUnit.Rad;
		} else {
			this.angleUnit = +settings.angleUnit;
		}
		this.useUnits = settings.useUnits ?? true;
		this.useUnitPrefixes = settings.useUnitPrefixes ?? true;
		this.useDecimalPoint = settings.useDecimalPoint ?? false;
		this.additionalOptions = settings.additionalOptions ?? false;
	}

	save() {
		if (typeof window === 'undefined') return;
		window.localStorage?.setItem(
			'qalculator-settings',
			JSON.stringify({
				angleUnit: this.angleUnit,
				useUnitPrefixes: this.useUnitPrefixes,
				useDecimalPoint: this.useDecimalPoint,
				additionalOptions: this.additionalOptions,
			}),
		);
	}

	getCleanedAdditionalOptions() {
		return this.additionalOptions
			.split('\n')
			.filter((option) => !!option)
			.map((option) => {
				if (option.startsWith('set ')) option = option.slice(4);
				const endsWithErrorSign = option.endsWith(' ✗');
				const cleanedOption = endsWithErrorSign
					? option.slice(0, -2)
					: option;
				return cleanedOption;
			});
	}

	apply() {
		this.getCleanedAdditionalOptions().forEach((option) =>
			setOption(option),
		);

		setOption(`angle ${+this.angleUnit}`);
		setOption(`units ${this.useUnits ? 'on' : 'off'}`);
		setOption(`varunits ${this.useUnits ? 'on' : 'off'}`);
	}

	constructor() {
		this.load();
	}
}
