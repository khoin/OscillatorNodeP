registerProcessor('OscillatorNodeP', class extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [
			["detune", 0, -sampleRate, sampleRate, "a-rate"],
			["frequency", 440, 0, sampleRate/2, "a-rate"],
			["phase", 0, 0, 2*Math.PI, "a-rate"]	
		].map(x => new Object({
			name: x[0],
			defaultValue: x[1],
			minValue: x[2],
			maxValue: x[3],
			automationRate: x[4]
		}));
	}

	constructor(options) {
		super(options); 

		this.i = 1/sampleRate;
		this.phase = 0;
	}

	process(inputs, outputs, parameters) {
		let f = parameters.frequency.length > 1? 
			parameters.frequency : (new Float32Array(128)).fill(parameters.frequency[0]);
		let d = parameters.detune.length > 1? 
			parameters.detune : (new Float32Array(128)).fill(parameters.detune[0]);
		let p = parameters.phase.length > 1? 
			parameters.phase : (new Float32Array(128)).fill(parameters.phase[0]);

		for(let k = 0; k < 128; k++) {
			this.phase += (f[k] + d[k]) * this.i;

			for(let i = 0; i < outputs.length; i++)
				for(let j = 0; j < outputs[i].length; j++) {
						outputs[i][j][k] = Math.sin(p[k] + Math.PI * 2 * this.phase);
					}
		}

		return true;
	}
});
