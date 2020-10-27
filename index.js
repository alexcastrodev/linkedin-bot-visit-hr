const { Builder, By, Key, until } = require("selenium-webdriver");
const { Driver } = require("selenium-webdriver/chrome");
const chrome = require("selenium-webdriver/chrome");

const { insertData, getAll, getOne, update } = require("./sqlite");

//var options = new chrome.Options().headless();
var driver = new Builder()
    .forBrowser("chrome")
    //.setChromeOptions(options)
    .build();

const goHack = (() => {
    driver
        .get("http://www.linkedin.com")
        .then((_) => {
            driver
                .findElement(By.id("session_key"))
                .sendKeys("YOUR_EMAIL", Key.TAB);
        })
        .then((_) =>
            driver
                .findElement(By.id("session_password"))
                .sendKeys("YOUR_PASSWORD", Key.ENTER)
        )
        .then((_) => console.log("login: ok"))
        .then((_) => {
            repeat();
        });
})();

function repeat() {
    console.log("Init looping");
    driver.wait(check_title, 10000).then((_) => {
        console.log("Linkedin page: ok");
        driver
            .wait(getRecruiter, 10000)
            .then((res) => {
                console.log(`recruiter: ok => ${res}`);
                if (res) {
                    console.log("go to recruiter");
                    driver.get(res);
                } else {
                    repeat();
                }
            })
            .then(async () => {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            })
            .then((_) => driver.wait(getPersonas, 10000))
            .then((res) => {
                insertData(res);
            })
            .then(
                async () =>
                    await new Promise((resolve) => setTimeout(resolve, 180000))
            )
            .then((_) => {
                repeat();
            })
            .catch((e) => {
                console.log("something went wrong");
            });
    });
}

function check_title() {
    var promise = driver.getTitle().then(function (title) {
        if (title.split(" ").includes("LinkedIn")) {
            console.log("success");
            return true;
        } else {
            console.log("fail -- " + title);
        }
    });
    return promise;
}

function getPersonas() {
    let promise = driver.executeScript(() => {
        let personas = [];
        let elements = Object.values(
            document.getElementsByClassName(
                "pv-browsemap-section__member-container pv-browsemap-section__member-container-line align-items-center ember-view"
            )
        );
        elements.map((element) => {
            personas.push(element.getElementsByTagName("a")[0].href);
        });
        return personas;
    });
    console.log(`Getting personas: ${JSON.stringify(promise)}`);
    return promise;
}

async function getRecruiter() {
    return new Promise(async (resolve) => {
        let persons = await getOne();
        let person = persons || [];
        console.log(`my recruiter: ${JSON.stringify(person)}`);
        if (person.length > 0) {
            person = person[0];
            update(person.href);
        } else {
            persons = await getAll();
            person = persons || [];
            if (person.length > 0) {
                person = person[0];
                update(person.href);
            }
        }

        console.log(`my recruiter URL: ${person.href}`);
        resolve((person || {}).href);
    });
}
