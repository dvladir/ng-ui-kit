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
    stage("Prepeare env") {
      parallel {
        stage("DEV ENV") {
          when {branch 'develop'}
          steps {
            script {
              env.INSTALL_CONFIG = 'dev-npm-rc'
              env.PUBLISH_CONFIG = 'dev-npm-rc-publish'
            }
          }
        }
        stage("MASTER ENV") {
          when {branch 'master'}
          steps {
            script {
              env.INSTALL_CONFIG = 'master-npm-rc'
              env.PUBLISH_CONFIG = 'master-npm-rc-publish'
            }
          }
        }
      }
    }
    stage("Show env") {
      steps {
        echo "INSTALL: '${INSTALL_CONFIG}'"
        echo "PUBLISH: '${PUBLISH_CONFIG}'"
      }
    }
    stage("Install"){
      steps {
        withNPM(npmrcConfig: '${INSTALL_CONFIG}') {
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
    stage("Publish") {
      steps {
        dir('dist/dvladir/ng-ui-kit') {
          withNPM(npmrcConfig: '${PUBLISH_CONFIG}') {
            sh "yarn publish --access public --non-interactive --verbose"
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
