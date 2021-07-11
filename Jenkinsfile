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
    state("Install") {
      steps {
        withNPM(npmrcConfig: 'dev-npm-rc') {
          sh "yarn"
        }
      }
    }
    stage("Build") {
      steps {
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
