import React from "react";
import * as lodash from "lodash";
import RemoteButton from "example_guest_2/Button";

const style = {
	background: "#00c",
	color: "#fff",
	padding: 12,
};

const Button = () => (
	<>
		<button type="button" style={style}>
			Guest Button - lodash {lodash.VERSION}
		</button>
		<React.Suspense fallback="Loading Guest 2 Button">
			<RemoteButton />
		</React.Suspense>
	</>
);

export default Button;
