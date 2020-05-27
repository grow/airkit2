# Builds and publishes docs.
docs:
	npm run docs
	git add .
	git commit -m 'Update docs'
	git push origin master


# Publishes airkit2 to npm registry.
publish:
	npm version patch
	git push origin master --tags
	npm publish

.PHONY: publish


# Starts a local devserver.
run:
	npm run dev

.PHONY: run
