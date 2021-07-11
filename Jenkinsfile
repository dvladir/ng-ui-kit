pipeline {
  options {
    disableConcurrentBuilds()
  }

  agent {
    dockerfile {
      filename 'Dockerfile.build'
      args "-v /usr/src/app:/usr/src/app -w /usr/src/app"
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
