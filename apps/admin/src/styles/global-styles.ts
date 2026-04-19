import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, 
	figure, figcaption, footer, header, hgroup, 
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure, 
	footer, header, hgroup, menu, nav, section {
		display: block;
	}
	html, body {
		margin: 0;
		height: 100%;
		
	}
	body {
		line-height: 1;
	}
	ol, ul {
		list-style: none;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
	}

	a {
		text-decoration: none;
		color: inherit;
	}

	#root {
		height: 100%;
	}

	body,
	body *,
	body::before,
	body::after,	
	body *::before,
	body *::after  {
		box-sizing: border-box;
		font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	body {
		background-color: #fff;
	}

	button {
		outline: 0;
    border: 0;
		padding: 0;
		user-select: none;
		background-color: transparent;
		cursor: pointer;
	}

	button:disabled {
		cursor: not-allowed;
	}

	input {
		padding: 0;
	}

	input:focus { outline: none; }

	.visually-hidden {
		clip: rect(0, 0, 0, 0);
		clip-path: inset(50%);
		width: 1px;	
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
	}

	.ReactModal__Overlay {
		z-index: 1001;
	}
	.modal {
		width: 1024px;
		height: 600px;
		position: absolute;
		top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    inset: 40px;
    border: 1px solid rgb(204, 204, 204);
    background: rgb(255, 255, 255);
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
	}
	.modal.admin_register_modal {
		width: 600px;
		height: 300px;
	}
	table.list-table {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid #ddd;
		th, td {
			border: 1px solid #ddd;
			border-collapse: collapse;
		}
		thead {
			background-color: #f5f5f5;
			font-weight: bold;
			font-size: 12px;
			tr {
				height: 24px;
				align-items: center;
				th {
					vertical-align: middle;
				}
			}
		}
		tbody {
			font-size: 12px;
			tr {
				height: 24px;
				align-items: center;
				td {
					text-align: center;
					vertical-align: middle;
				}
			}
		}
		tfoot {
			font-size: 12px;
			background-color: #f5f5f5;
			tr {
				height: 24px;
				align-items: center;
				td {
					text-align: center;
					vertical-align: middle;
				}
			}
		}
	}

	table.my-table {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid #DADCDE;
		th, td {
			border: none;
			border-collapse: collapse;
		}
		thead {
			background-color: #F6F6F7;
			font-weight: bold;
			font-size: 12px;
			tr {
				height: 48px;
				padding: 0px 8px;
				align-items: center;
				th {
					vertical-align: middle;
				}
			}
		}
		tbody {
			font-size: 12px;
			tr {
				height: 48px;
				padding: 0px 8px;
				align-items: center;
				td {
					text-align: center;
					vertical-align: middle;
				}
			}
		}
		tfoot {
			font-size: 12px;
			background-color: #F6F6F7;
			tr {
				height: 24px;
				align-items: center;
				td {
					text-align: center;
					vertical-align: middle;
				}
			}
		}
	}
	.justify-center {
		justify-content: center !important;
	}
	.underline {
			color: #0000EE;
      cursor: pointer;
			&:visited {
				color: #551A8B;
			}
			&:active {
				color: #FF0000;
			}
      &:hover {
        text-decoration: underline;
      }
	}
	input[readonly] {
		cursor: pointer;
	}
`;
