import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Router, RouterLinkWithHref } from "@angular/router";
import { clickElement, query, queryAllByDirective } from "src/testing";
import { routes } from "./app-routing.module";
import { AppModule } from "./app.module";

fdescribe('App Integration test', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule.withRoutes(routes),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //providers
    router = TestBed.inject(Router);

    router.initialNavigation();

    tick(); //wait while nav...
    fixture.detectChanges(); // ngOnInit
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should be 7 routerLinks', () => {
    const links = queryAllByDirective(fixture, RouterLinkWithHref);
    expect(links.length).toEqual(7);
  });

  it('should render OthersComponet when clicked', fakeAsync(() => {
    clickElement(fixture, 'others-link', true);

    tick(); //wait while nav...
    fixture.detectChanges(); // ngOnInit - OtherComponent

    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).not.toBeNull();
  }));

  it('should render PeopleComponet when clicked', fakeAsync(() => {
    clickElement(fixture, 'people-link', true);

    tick(); //wait while nav...
    fixture.detectChanges(); // ngOnInit - OtherComponent

    expect(router.url).toEqual('/people');
    const element = query(fixture, 'app-people');
    expect(element).not.toBeNull();
  }));

});
