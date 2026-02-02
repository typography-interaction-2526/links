// Okay, Are.na stuff!
let channelSlug = 'typography-and-interaction-too' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = async (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = data.description.html
	channelCount.innerHTML = data.counts.blocks
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (block.type == 'Link') {
		// Declares a “template literal” of the dynamic HTML we want.
		let linkItem =
			`
			<li>
				<p><em>Link</em></p>
				<figure>
					<picture>
						<source media="(width < 500px)" srcset="${ block.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ block.image.medium.src_2x }">
						<img alt="${block.image.alt_text}" src="${ block.image.large.src_2x }">
					</picture>
					<figcaption>
						<h3>${ block.title }</h3>
						${ block.description.html }
					</figcaption>
				</figure>
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</li>
			`

		// And puts it into the page!
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)

		// More on template literals:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	}

	// Images!
	else if (block.type == 'Image') {
		// …up to you!
	}

	// Text!
	else if (block.type == 'Text') {
		// …up to you!
	}

	// Uploaded (not linked) media…
	else if (block.type == 'Attachment') {
		let contentType = block.attachment.content_type // Save us some repetition.

		// Uploaded videos!
		if (contentType.includes('video')) {
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
		else if (contentType.includes('pdf')) {
			// …up to you!
		}

		// Uploaded audio!
		else if (contentType.includes('audio')) {
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

	// Linked (embedded) media…
	else if (block.type == 'Embed') {
		let embedType = block.embed.type

		// Linked video!
		if (embedType.includes('video')) {
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
		else if (embedType.includes('rich')) {
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



// Now that we have said all the things we *can* do, go get the channel data:
fetch(`https://api.are.na/v3/channels/${channelSlug}`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON.
	.then((data) => { // Do stuff with the data.
		console.log(data) // Always good to check your response!

		placeChannelInfo(data) // Pass the data to the first function.
	})

// And the data for the blocks:
fetch(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, { cache: 'no-store' })
	.then((response) => response.json())
	.then((data) => {
		console.log(data) // See what we get back.

		// Loop through the nested `data` array (list).
		data.data.forEach((block) => {
			// console.log(block) // The data for a single block.
			renderBlock(block) // Pass the single block data to the render function.
		})
	})
