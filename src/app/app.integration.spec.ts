import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Router, RouterLinkWithHref } from "@angular/router";
import { asyncData, clickElement, getText, mockObservable, query, queryAllByDirective } from "src/testing";
import { routes } from "./app-routing.module";
import { AppModule } from "./app.module";
import { ProductsService } from "./services/product.service";
import { generateManyProducts } from "./models/product.mock";
import { AuthService } from "./services/auth.service";
import { generateOneUser } from "./models/user.mock";

fdescribe('App Integration test', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let productService: jasmine.SpyObj<ProductsService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
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
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

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

  it('should render OthersComponet when clicked with session', fakeAsync(() => {
    const productsMocks = generateManyProducts(10);
    productService.getAll.and.returnValue(asyncData(productsMocks));

    const userMock = generateOneUser();
    authService.getUser.and.returnValue(mockObservable(userMock));

    clickElement(fixture, 'others-link', true);

    tick(); //wait while nav...
    fixture.detectChanges(); // ngOnInit - OtherComponent

    tick();
    fixture.detectChanges();

    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).not.toBeNull();
    const text = getText(fixture, 'products-lenght');
    expect(text).toContain(productsMocks.length);
  }));

  it('should render OthersComponet when clicked without session', fakeAsync(() => {
    authService.getUser.and.returnValue(mockObservable(null));

    clickElement(fixture, 'others-link', true);

    tick(); //wait while nav...
    fixture.detectChanges(); // ngOnInit - OtherComponent

    tick();
    fixture.detectChanges();

    expect(router.url).toEqual('/');
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
