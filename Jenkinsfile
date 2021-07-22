pipeline {
  options {
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
  }

  agent {
    dockerfile {
      filename 'Dockerfile.build'
      args "-v /usr/src/app:/usr/src/app -w /usr/src/app"
    }
  }

  stages {
    stage("Prepare") {
      agent any
      steps {
        cleanWs()
        checkout scm
      }
    }
    stage("Install"){
      steps {
        withNPM(npmrcConfig: 'dev-npm-rc') {
          sh "echo INSTALL"
          sh "yarn --verbose"
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
    stage("Postbuild") {
      steps {
        sh "echo NPMRC"
        sh "cat .npmrc"
        sh "echo LOCK_FILE"
        sh "cat yarn.lock"
      }
    }
  }
}
