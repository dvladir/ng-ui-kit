pipeline {
  options {
    disableConcurrentBuilds()
  }

  agent {
    dockerfile {
      filename 'Dockerfile.build'
      args '-v /usr/src/app:/usr/src/app -w /usr/src/app --net=host'
    }
  }

  stages {
    stage("Install"){
      steps {
        withNPM(npmrcConfig: 'dev-npm-rc') {
          echo INSTALL
          yarn --verbose
        }
      }
    }
    stage("Build") {
      steps {
        yarn build-lib
      }
    }
    stage("Test") {
      steps {
        yarn test-lib
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

  post {
    always {
      echo NPMRC
      cat .npmrc
      echo LOCK_FILE
      cat yarn.lock
      cleanWs()
    }
  }
}
