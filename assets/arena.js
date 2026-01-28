// This library allows us to process/render the descriptions, which are returned in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
const markdownIt = new Promise((resolve) =>
	document.head.appendChild(
		Object.assign(document.createElement('script'), {
			src: 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js',
			onload: resolve
		})
	)
)



// Okay, Are.na stuff!
let channelSlug = 'typography-and-interaction-too' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = async (data) => {
	await markdownIt // Wait for the library to load, `async`.

	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (block.class == 'Link') {
		// Declares a “template literal” of the dynamic HTML we want.
		let linkItem =
			`
			<li>
				<p><em>Link</em></p>
				<picture>
					<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
					<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
					<img src="${ block.image.original.url }">
				</picture>
				<h3>${ block.title }</h3>
				${ block.description_html }
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</li>
			`

		// And puts it into the page!
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)

		// More on template literals:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	}

	// Images!
	else if (block.class == 'Image') {
		// …up to you!
	}

	// Text!
	else if (block.class == 'Text') {
		// …up to you!
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li>
					<p><em>Video</em></p>
					<video controls src="${ block.attachment.url }"></video>
				</li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', videoItem)

			// More on `video`, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			// …up to you!
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li>
					<p><em>Audio</em></p>
					<audio controls src="${ block.attachment.url }"></video>
				</li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', audioItem)

			// More on`audio`:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<li>
					<p><em>Linked Video</em></p>
					${ block.embed.html }
				</li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)

			// More on `iframe`:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
		}
	}
}



// A function to display the owner and collaborators:
let renderChannelUsers = (data) => {
	let channelUsers = document.querySelector('#channel-users') // Container here for both.

	// You can have functions *inside* other functions, when they are only used there!
	let renderUser = (user, container) => { // You also can have multiple arguments for a function!
		let userAddress =
			`
			<address>
				<img src="${ user.avatar_image.display }">
				<h3>${ user.first_name }</h3>
				<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
			</address>
			`

		container.insertAdjacentHTML('beforeend', userAddress)
	}

	// Collaborators can be multiple.
	data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))

	// There is only one owner.
	renderUser(data.owner, channelUsers)
}



// Now that we have said all the things we *can* do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data.
		console.log(data) // Always good to check your response!

		placeChannelInfo(data) // Pass the data to the first function.

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block.
			renderBlock(block) // Pass the single block data to the render function.
		})

		renderChannelUsers(data) // And data for our users.
	})
