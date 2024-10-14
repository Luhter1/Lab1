plugins {
    id("java")
}


group = "org.web"
version = "1.0-SNAPSHOT"

repositories {
    flatDir {
        dirs("libs")
    }
}

dependencies {
    implementation(":fastcgi-lib")
}

tasks.jar{
    manifest.attributes["Main-Class"] = "org.web.Main"

    val dependencies = configurations
        .runtimeClasspath
        .get()
        .map(::zipTree) // OR .map { zipTree(it) }
    from(dependencies)
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE

    archiveFileName = "server.jar"
    destinationDirectory.set(file("lab1"))
}


