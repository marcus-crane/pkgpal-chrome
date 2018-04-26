currentRegistry = ''

function parseURL () {
    const url = window.location.pathname
    const extensions = ['requirements.txt', 'package.json']
    for (let extension of extensions) {
        if (url.includes(extension)) {
            if (extension == 'requirements.txt') {
                currentRegistry = 'pypi'
                return true
            }

            if (extension == 'package.json') {
                currentRegistry = 'npm'
                return true
            }
        }
    }
    return false
}

function handleError (response) {
    if (!response.ok) {
        throw Error()
    }
    return response.json()
}

function setTooltip(item, description) {
    item.className += " tooltipped"
    item.setAttribute('aria-label', description)
}

function queryPackage (item, registry, package) {
    fetch(`https://pkg.thingsima.de/${registry}/${package}`)
        .then(handleError)
        .then(res => setTooltip(item, res.description))
        .catch(error => {
            console.error('Woops, something went wrong with fetching that package!')
        })
}

function fetchLines (currentRegistry) {
    if (currentRegistry == 'pypi') {
        lines = document.getElementsByClassName('blob-code')
        for (let line of lines) {
            line.addEventListener("mouseover", function() {
                package = line.innerText
                let description = 'Loading...'
                if (package.includes('==')) {
                    queryPackage(line, currentRegistry, package.split('==')[0])
                } else {
                    queryPackage(line, currentRegistry, package)
                }
            }, false)
            line.addEventListener("mouseout", function() {
                line.className = line.className.split(' ').filter(item => item != 'tooltipped').join(' ')
            })
        }
    }
}

packagePage = parseURL()
if (packagePage) {
    fetchLines(currentRegistry)
}