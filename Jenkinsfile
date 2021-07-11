pipeline {
  options {
    disableConcurrentBuilds()
  }

  agent {
    dockerfile {
      filename 'Dockerfile.build'
      label "build-image"
      args "-v ${PWD}:/usr/src/app -w /usr/src/app"
      reuseNode true
    }
  }

  stages {
    stage("Build") {
      steps {
        sh "yarn"
        sh "yarn build-lib"
      }
    }
    stage("Test") {
      steps {
        sh "yarn test-lib"
      }
    }
  }
}
