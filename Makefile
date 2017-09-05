#
# Tools
#
TOP		:= $(shell pwd)
NODE_MODULES	:= $(TOP)/node_modules
NPM		:= npm
NODE_BIN	:= $(shell $(NPM) bin)
ESLINT		:= $(NODE_BIN)/eslint
JSCS		:= $(NODE_BIN)/jscs
TAPE		:= $(NODE_BIN)/tape
NYC		:= $(NODE_BIN)/nyc

#
# Files
#
JS_FILES	:= index.js
TEST_FILES	:= test/index.js
CLEAN_FILES	+= node_modules

#
# Repo-specific targets
#
.PHONY: all
all: node_modules check

.PHONY: lint
lint: node_modules $(ESLINT) $(JS_FILES)
	$(ESLINT) $(JS_FILES)

.PHONY: style
style: node_modules $(JSCS) $(JS_FILES)
	$(JSCS) $(JS_FILES)

.PHONY: test
test: node_modules $(TAPE) $(NYC)
	$(NYC) $(TAPE) $(TEST_FILES)

.PHONY: fixstyle
fixstyle: node_modules $(JSCS) $(JS_FILES)
	$(JSCS) --fix $(JS_FILES)

node_modules: package.json
	$(NPM) install -d
	@touch node_modules

.PHONY: check
check: lint style test

.PHONY: clean
clean:
	@rm -rf $(CLEAN_FILES)

.PHONY: distclean
distclean:
	@rm -rf $(CLEAN_FILES)

#
# Debug -- print out a a variable via `make print-FOO`
#
print-%  : ; @echo $* = $($*)
